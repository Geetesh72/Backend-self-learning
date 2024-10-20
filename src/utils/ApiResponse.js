class ApiResponse{
    constructor(statusCode,data,message="success"){
        this.statusCode  = statusCode
        this.data = data
        this.message = message
        this.success = statusCode
         
        /**
        informational Response (100-199)
        successful response (200-300)
        redireciton message (300-399)
        client error responses (400-499)
        server error responses(500-599)
         */
    }
}
export {ApiResponse}