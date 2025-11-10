export class ErrorValidacion extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'BadRequest';
        this.statusCode = 400;
    }
}

export class ErrorTamañoArchivo extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'PayloadTooLarge';
        this.statusCode = 413;
    }
}

export class ErrorExtensionArchivo extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'UnsupportedExtension';
        this.statusCode = 415;
    }
}

export class ErrorRecursoNoEncontrado extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class ErrorServidor extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'ServerError';
        this.statusCode = 500;
    }
}