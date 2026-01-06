package com.ritense.valtimoplugins.openklant.dto

interface Referable {
    val uuid: String
    val url: String

    fun getObjectReference(): ObjectReference = ObjectReference(uuid, url)

    fun getUuidReference(): UuidReference = UuidReference(uuid)
}
