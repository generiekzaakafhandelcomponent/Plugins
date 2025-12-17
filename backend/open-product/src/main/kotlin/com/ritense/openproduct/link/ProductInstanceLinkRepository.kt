package com.ritense.openproduct.link

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProductInstanceLinkRepository : JpaRepository<ProductInstanceLink, UUID> {
    fun findFirstByDocumentId(documentId: UUID): ProductInstanceLink?
}
