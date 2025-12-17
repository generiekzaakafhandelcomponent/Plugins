package com.ritense.openproduct.link

import java.time.Instant
import java.util.UUID
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "product_instance_link")
class ProductInstanceLink() {

    @Id
    @Column(name = "product_instance_link_id", nullable = false)
    lateinit var productInstanceLinkId: UUID

    @Column(name = "product_instance_url", nullable = false, length = 1024)
    lateinit var productInstanceUrl: String

    @Column(name = "product_instance_id", nullable = false)
    lateinit var productInstanceId: UUID

    @Column(name = "document_id", nullable = false)
    lateinit var documentId: UUID

    @Column(name = "product_type_uuid", nullable = true)
    var productTypeUuid: UUID? = null

    @Column(name = "created_on")
    var createdOn: Instant? = null

    constructor(
        productInstanceUrl: String,
        productInstanceId: UUID,
        documentId: UUID,
        productTypeUuid: UUID?
    ) : this() {
        this.productInstanceLinkId = UUID.randomUUID()
        this.productInstanceUrl = productInstanceUrl
        this.productInstanceId = productInstanceId
        this.documentId = documentId
        this.productTypeUuid = productTypeUuid
        this.createdOn = Instant.now()
    }
}
