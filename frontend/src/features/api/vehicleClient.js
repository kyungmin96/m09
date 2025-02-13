 import { api } from "./apiClient";

 const vehicleService = {
    /* 
        Member Section
    */
   
    // Member: 차량 찾기
    async findAllVehicles() {
        const response = api.get('/member/vehicles');
        return response;
    },
 };

 export { vehicleService };