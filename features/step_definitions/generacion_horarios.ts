import { Given, setDefaultTimeout, Then, When } from '@cucumber/cucumber';
import { HorarioService } from '../../src/horario/services/horario.service';
import { leerArchivo } from '../../src/utils/functions/leer-archivo';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

setDefaultTimeout(60 * 2000);

Given('el archivo de planificación {string},', async function (nombre: string) {
  const pathArchivo = path.join(__dirname, '..', 'documents_test', nombre);
  this.contenido = leerArchivo(pathArchivo);
});

When('se reutilice el motor del software FET desde la API,', async function () {
  this.horarioService = await this.app.get(HorarioService);
  const horario = this.horarioService.generarHorarioXML(this.contenido);
  this.horario = horario;
});

Then(
  'se obtendrán los horarios por subgrupo generados en etiquetas XML.',
  function () {
    assert(this.horario.length > 0);
  },
);
