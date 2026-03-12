# Generador de Cuentas de Cobro

Aplicación web ligera para la generación rápida de cuentas de cobro en formato PDF, diseñada específicamente para uso móvil.

## Características
- **Almacenamiento Local:** Los clientes frecuentes se guardan en la memoria del navegador (`localStorage`) para agilizar futuros cobros.
- **Conversor Numérico:** Traduce automáticamente el valor en números a texto legal en español en tiempo real.
- **Exportación Nativa:** Utiliza el sistema de impresión del dispositivo para generar un PDF nítido, tamaño carta y con texto seleccionable.
- **Diseño Responsivo:** Interfaz construida con Tailwind CSS, optimizada para llenarse rápidamente desde un teléfono celular.

## Uso
1. Ingresa la fecha y selecciona (o crea) un cliente.
2. Digita el valor total y el concepto del trabajo.
3. Ajusta el zoom si deseas revisar el documento completo en la vista previa.
4. Presiona "Descargar PDF" para guardar el archivo final.