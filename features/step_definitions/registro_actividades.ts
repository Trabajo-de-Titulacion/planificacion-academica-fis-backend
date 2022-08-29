
import { Given } from "@cucumber/cucumber"
import { AsignaturaService } from "../../src/asignatura/services/asignatura.service";
import { DocenteService } from "../../src/docente/services/docente.service";

Given('Dado que existe un docente con correo {string}', async function (correo_docente: string) {
    this.docenteService = await this.app.get(DocenteService);
    this.docente = this.docenteService.obtenerDocentePorCorreoElectronico(correo_docente);
});

Given('Y la asignatura con código {string}', async function (codigo_asignatura: string) {
    this.asignaturaService = await this.app.get(AsignaturaService);
    this.asignatura = this.docenteService.obtenerAsignaturaPorCodigo(codigo_asignatura);
});

Given('Y un grupo con códgo {string}', async function (codigo_subgrupo: string) {
    //    this.grupoController = await this.app.get(GrupoController);
});



