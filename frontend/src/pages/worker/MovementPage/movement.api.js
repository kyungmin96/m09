import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

/**
 * 수동 주행 - 전진
 */
export const manualDriveForward = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.MANUAL_DRIVE.FORWARD);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("수동 주행 전진 요청 중 오류 발생");
    }
};

/**
 * 수동 주행 - 후진
 */
export const manualDriveBackward = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.MANUAL_DRIVE.BACKWARD);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("수동 주행 후진 요청 중 오류 발생");
    }
};

/**
 * 수동 주행 - 좌회전
 */
export const manualDriveLeft = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.MANUAL_DRIVE.LEFT);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("수동 주행 좌회전 요청 중 오류 발생");
    }
};

/**
 * 수동 주행 - 우회전
 */
export const manualDriveRight = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.MANUAL_DRIVE.RIGHT);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("수동 주행 우회전 요청 중 오류 발생");
    }
};

/**
 * 수동 주행 - 정지
 */
export const manualDriveStop = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.MANUAL_DRIVE.STOP);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("수동 주행 정지 요청 중 오류 발생");
    }
};

/**
 * 주행 시작 요청
 */
export const startDrive = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.DRIVE.START);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("주행 시작 요청 중 오류 발생");
    }
};

/**
 * 주행 정지 요청
 */
export const stopDrive = async () => {
    try {
        const response = await api.post(API_ROUTES.EMBEDDED.DRIVE.STOP);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response?.data;
        }
        throw new Error("주행 정지 요청 중 오류 발생");
    }
};