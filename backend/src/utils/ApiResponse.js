class ApiResponse {
  constructor(status, messsage = "Success", data = null) {
    this.status = status;
    this.messsage = messsage;
    this.data = data;
    this.success = true;
  }
}
export default ApiResponse;
