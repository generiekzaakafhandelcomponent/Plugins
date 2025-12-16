package com.ritense.valtimoplugins.openklant.dto

interface Referable {
    val uuid: String
    val url: String

    fun makeReference(): ObjectReference = ObjectReference(uuid, url)

    fun makeUuidReference(): UuidReference = UuidReference(uuid)
}