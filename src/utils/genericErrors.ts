class getAllError extends Error {
    constructor(){
        super("Failed to retrieve list")
        this.name = "GetAllError"
    }
}


class updateError extends Error {
    constructor(){
        super("Failed to update record")
        this.name = "UpdateError"
    }
}

class deleteError extends Error {
    constructor(){
        super("Failed to delete record")
        this.name = "DeleteError"
    }
}

class creationError extends Error {
    constructor(message: string){
        super(message)
        this.name = "CreationError"
    }
}

class recordNotFoundError extends Error {
    constructor(){
        super("Record has not found yet")
        this.name = "RecordNotFound"
    }
}




export {
    getAllError,
    creationError,
    updateError,
    deleteError,
    recordNotFoundError,
}