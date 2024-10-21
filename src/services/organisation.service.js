import instance, { formsRequestInstance } from "../api";

class InstitutionService {
    create(data) {
        return instance.postForm('institutions/', data)
    }

    get(id) {
        return instance.get(`institutions/${id}/`)
    }
    getByTenantId(tenantId) {
        return instance.get(`/institutions/get-by-tenantId/${tenantId}/`)
    }
    getLogoByTenantId(tenantId) {
        return instance.get(`/institutions/get-institution-logo/${tenantId}/`)
    }

    getAll() {
        return instance.get('institutions/get-all-institutions/')
    }

    getTotalNumberOfInstitutions() {
        return instance.get('institutions/get-total-number-of-institutions/')
    }

    updateInstitutionLogo(id, data) {
        return formsRequestInstance.postForm(`institutions/update-institution-logo/${id}/`, data)
    }
}

export default new InstitutionService();