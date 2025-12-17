package com.ritense.openproduct.service

import com.ritense.openproduct.client.OpenProductClient
import com.ritense.openproduct.client.ProductResponse
import com.ritense.openproduct.link.ProductInstanceLink
import com.ritense.openproduct.link.ProductInstanceLinkRepository
import com.ritense.openproduct.plugin.OpenProductPlugin
import com.ritense.plugin.service.PluginConfigurationSearchParameters
import com.ritense.plugin.service.PluginService
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ProductService(
    private val pluginService: PluginService,
    private val client: OpenProductClient,
    private val linkRepository: ProductInstanceLinkRepository
) {
    // Resolve once per service (or cache per request)
    private fun cfg(): OpenProductPlugin {
        val pc = pluginService.getPluginConfigurations(
            PluginConfigurationSearchParameters(pluginConfigurationTitle = "openproduct")
        ).first()
        return pluginService.createInstance(pc) as OpenProductPlugin
    }

    fun getByDocumentIdOrThrow(documentId: String): ProductResponse {
        val docUuid = UUID.fromString(documentId)
        val link = linkRepository.findFirstByDocumentId(docUuid)
            ?: throw IllegalStateException("No product link found for document $documentId")

        val plugin = cfg()
        val product = client.getProduct(
            plugin.baseUrl,
            plugin.authenticationPluginConfiguration,
            link.productInstanceId.toString()
        )
            ?: throw IllegalStateException("Product ${link.productInstanceId} not found")

        // Map naar ProductResponse indien nodig; als getProduct al ProductResponse terug zou geven, pas types aan.
        return ProductResponse(
            uuid = product.uuid,
            url = product.url,
            naam = product.naam,
            startDatum = product.startDatum,
            eindDatum = product.eindDatum,
            aanmaakDatum = product.aanmaakDatum,
            updateDatum = product.updateDatum,
            producttype = product.producttype,
            gepubliceerd = product.gepubliceerd,
            status = product.status,
            prijs = product.prijs,
        )
    }

    fun link(documentId: String, product: ProductResponse) {
        val docUuid = UUID.fromString(documentId)
        val existing = linkRepository.findFirstByDocumentId(docUuid)
        if (existing == null) {
            linkRepository.save(
                ProductInstanceLink(
                    productInstanceUrl = product.url,
                    productInstanceId = product.uuid,
                    documentId = docUuid,
                    productTypeUuid = product.producttype.uuid
                )
            )
        } else {
            var changed = false
            if (existing.productInstanceUrl != product.url) {
                existing.productInstanceUrl = product.url
                changed = true
            }
            if (existing.productInstanceId != product.uuid) {
                existing.productInstanceId = product.uuid
                changed = true
            }
            val ptu = product.producttype.uuid
            if (existing.productTypeUuid != ptu) {
                existing.productTypeUuid = ptu
                changed = true
            }
            if (changed) linkRepository.save(existing)
        }
    }

    fun link(documentId: String, productUuid: String) {
        val plugin = cfg()
        val product = client.getProduct(plugin.baseUrl, plugin.authenticationPluginConfiguration, productUuid)
            ?: throw IllegalStateException("Product $productUuid not found for linking")
        // Map naar ProductResponse
        link(
            documentId,
            ProductResponse(
                uuid = product.uuid,
                url = product.url,
                naam = product.naam,
                startDatum = product.startDatum,
                eindDatum = product.eindDatum,
                aanmaakDatum = product.aanmaakDatum,
                updateDatum = product.updateDatum,
                producttype = product.producttype,
                gepubliceerd = product.gepubliceerd,
                status = product.status,
                prijs = product.prijs,
            )
        )
    }
}