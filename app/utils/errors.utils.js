class DoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "DoesNotExistError";
        this.errorCode = "SR-0404";
        this.status = 404;
    }
}

class AlreadyExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyExistError";
        this.errorCode = "SR-0404";
        this.status = 404;
    }
}

class CannotUpdateError extends Error {
    constructor(message) {
        super(message);
        this.name = "CannotUpdateError";
        this.errorCode = "SR-0404";
        this.status = 404;
    }
}

class CannotDeleteError extends Error {
    constructor(message) {
        super(message);
        this.name = "CannotDeleteError";
        this.errorCode = "SR-0404";
        this.status = 404;
    }
}

class InvalidRequestError extends Error {
    constructor(message) {
        super(message || "Invalid Request");
        this.name = "InvalidRequestError";
        this.errorCode = "SR-0400";
        this.status = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.errorCode = "SR-0401";
        this.status = 401;
    }
}

module.exports = {
    DoesNotExistError,
    CannotUpdateError,
    CannotDeleteError,
    InvalidRequestError,
    AlreadyExistError,
    UnauthorizedError,
};
