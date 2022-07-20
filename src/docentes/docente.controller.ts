import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { DocenteService } from "./docente.service";
import { DocenteDto } from "./dto/docente.dto";
import { FileInterceptor } from "@nestjs/platform-express";
const crypto = require('crypto');

@Controller('docente')
export class DocenteController {

    constructor(private docenteService: DocenteService) { }

    @Post('crearUno')
    createDocente(@Body() docenteDto: DocenteDto) {

        // Crear el código con 20 digitos y bajo una lista de caracteres definido

        const generatePassword = (
            length = 20,
            wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
        ) =>
            Array.from(crypto.randomFillSync(new Uint32Array(length)))
                .map((x) => wishlist[Number(x) % wishlist.length])
                .join('')

        docenteDto.codigoIngreso = generatePassword();

        // Convertir en mayúsculas el nombre

        docenteDto.nombreCompleto = docenteDto.nombreCompleto.toUpperCase();

        return this.docenteService.createDocente(docenteDto);
    }

    @Post('crearVarios')
    @UseInterceptors(FileInterceptor('archivoDocentes'))
    createVariosDocentes(@UploadedFile() file: Express.Multer.File) {

        // Crear el código con 20 digitos y bajo una lista de caracteres definido

        const generatePassword = (
            length = 20,
            wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
        ) =>
            Array.from(crypto.randomFillSync(new Uint32Array(length)))
                .map((x) => wishlist[Number(x) % wishlist.length])
                .join('')

        // Leer el archivo y generar los Dtos

        const arregloDocente: DocenteDto[] = [];
        const informacionDocentes = file.buffer.toString().split(/['\r\n,']+/);

        for (let i = 0; i < informacionDocentes.length; i = i + 2) {
            if (informacionDocentes[i].trim() != "") {
                arregloDocente[i / 2] = {
                    nombreCompleto: informacionDocentes[i].toUpperCase(),
                    correoElectronico: informacionDocentes[i + 1],
                    codigoIngreso: generatePassword()
                }
            }

        }
        return this.docenteService.crearVariosDocentes(arregloDocente);
    }

}