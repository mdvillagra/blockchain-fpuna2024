# Requisitos
Python >= 3.12.1

Instalar dependencias
```
pip install -r poseidon_hash_main/requirements.txt
```
# Ejecutar
Para ejecutar con parametros por defecto
```
python main.py
```
Para ejecutar con parametros mas complejos (mayor tiempo de preparacion)
```
python main.py slow
```
# Ejemplo
Datos: ["Data 1", "Data 2", "Data 3", "Data 4", "Data 5"]
```
Creando arbol
0x2ff7818b512d51a7ec60c93def79ad72e2250375c6917cbbe874be60753e7bea
    0x27b61f72a57c0542ad1cf1bb5bb804940b7df278932da79703a87906de0dbb95-IZQ
        0x489e57550d3c2304f7f5f499aa7871b7697b5cfd5f63403846004cba83b94e72-IZQ
            0x2ad8510d35adaf57e85f409c2bee973f7373f541066890f5796313c2807321ba-IZQ
            0x6e7c5297b3b097d205365e8974f4be79501147825b5b05e7e24895a9cddade17-DER
        0x1db8d18fc38877aa43490efdee3af3db781a948f8a962677af01c15f32de8d98-DER
            0x5de0b9314804766372c6ecfe82d15ce96a4ab42caa887043e054c4214f4b85d7-IZQ
            0x446eb2f41aeecf869685d0ba01c6c4555ddbd60953f4dd329c2d1454f76fadfc-DER
    0x145c5f126334111bf8a825386763234acb486b84b6e99b110169e32aaaad6e0c-DER
        0x1cd2b61ba3a8d3456a1e786c5752d36a26dcfdd838b6606c4b7782ba4fd93f63-IZQ
            0x615841c57018c94c03146d35167d22e3727f6621b69fda1cf4cdc9cba4440d8d-IZQ
            0x6769de143b3936b614577111ef353a0a69cdec9f0d49c1d7835edfb4fbf6c828-DER
        0x4f8b7dda457a4673f1d63f5fd41370fb5a104caac7a36aa5ded89ebc0d87245a-DER
            0x6769de143b3936b614577111ef353a0a69cdec9f0d49c1d7835edfb4fbf6c828-IZQ
            0x6769de143b3936b614577111ef353a0a69cdec9f0d49c1d7835edfb4fbf6c828-DER

Obteniendo prueba de Merkle para "Data 1"
['0x6e7c5297b3b097d205365e8974f4be79501147825b5b05e7e24895a9cddade17-DER', '0x1db8d18fc38877aa43490efdee3af3db781a948f8a962677af01c15f32de8d98-DER',
'0x145c5f126334111bf8a825386763234acb486b84b6e99b110169e32aaaad6e0c-DER']
Caso invalido, Data 100
No se encontro el mensaje

Verificando prueba de Merkle
1
Caso invalido, otro dato con mismo proof
0
Caso invalido, mismo dato con proof modificado
0
```
