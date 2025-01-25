export default function apiResponse(success, message, data) {
    return {
        status: {
            success: success,
            message: message || ""
        },
        data: data || null
    }
}