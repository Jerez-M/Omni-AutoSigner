import instance from "../api";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../apiConfig";

class AuthenticationService {
    login(data) {
        return instance.post(`${API_URL}accounts/token/`, data)
    }

    verifyPassword(data) {
        return instance.post('accounts/verify-password/', data)
    }

    changePassword(data) {
        return instance.post('accounts/change-password/', data)
    }

    verifyToken(data) {
        return instance.post('accounts/token/verify/', data);
    }

    refreshToken(data) {
        return instance.post('accounts/token/refresh/', data)
    }

    logout() {
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    decodeToken() {
        const token = JSON.parse(localStorage.getItem('user'))?.access;
        return token && jwtDecode(token);
    }

    getRefreshToken() {
        return JSON.parse(localStorage.getItem('user'))?.refresh;
    }

    getUserRole() {
        const token = this.decodeToken();
        return token?.role;
    }

    getUsername() {
        const token = this.decodeToken();
        return token?.username;
    }

    getUserId() {
        const token = this.decodeToken();
        return token?.user_id;
    }

    getFullName() {
        const token = this.decodeToken();
        return (token?.first_name + " " + token?.last_name).toUpperCase()
    }

    getUserOrganisationId() {
        const token = this.decodeToken();
        return token?.organisation;
    }
}

export default new AuthenticationService();