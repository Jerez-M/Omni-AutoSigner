import instance from "../api";

class UnsignedContract {
    create(formData) {
        return instance.postForm('contracts/unsigned-contracts/', formData)
    }

    get(id) {
        return instance.get(`contracts/unsigned-contracts/${id}/`)
    }
    getAllByOrganisationId(organisation_id) {
        return instance.get(`contracts/unsigned-contracts/get-all-by-organisation-id/${organisation_id}/`)
    }

    getUnsignedContractsWithSignatures(organisation_id) {
        return instance.get(`contracts/unsigned-contracts-with-signatures/${organisation_id}/`)
    }

    update(id, formData) {
        return instance.putForm(`contracts/unsigned-contracts/update/${id}/`, formData)
    }

    delete(id) {
        return instance.delete(`contracts/unsigned-contracts/${id}/`)
    }
}

export default new UnsignedContract();