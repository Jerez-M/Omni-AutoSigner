import instance from "../api";

class SignedContract {
    create(data) {
        return instance.postForm('contracts/signed-contracts/', data)
    }

    get(id) {
        return instance.get(`contracts/signed-contracts/${id}/`)
    }

    getAllByOrganisationId(organisation_id) {
        return instance.get(`contracts/signed-contracts/get-all-by-organisation-id/${organisation_id}/`)
    }

    getAllByUnsignedContractId(id) {
        return instance.get(`contracts/signed-contracts/get-by-unsigned-contract-id/${id}/`)
    }

    update(data, id) {
        return instance.putForm(`contracts/signed-contracts/update/${id}`, data)
    }
}

export default new SignedContract();