import instance from "../api";

class UnsignedContract {
    create(data) {
        return instance.postForm('contracts/unsigned-contracts/', data)
    }

    get(id) {
        return instance.get(`contracts/unsigned-contracts/${id}/`)
    }
    getAllByOrganisationId(organisation_id) {
        return instance.get(`contracts/unsigned-contracts/get-all-by-organisation-id/${organisation_id}/`)
    }

    update(data, id) {
        return instance.putForm(`contracts/unsigned-contracts/update/${id}`, data)
    }

    delete(id) {
        return instance.delete(`contracts/unsigned-contracts/${id}/`)
    }
}

export default new UnsignedContract();