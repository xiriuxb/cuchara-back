import { ApiBody } from '@nestjs/swagger';

export const CreateRecipeSwagger = ApiBody({
  description: 'Crea una nueva receta',
  schema: {
    type: 'object',
    properties: {
      image: {
        type: 'string',
        format: 'binary',
        description: 'Imagen de la receta (jpg, jpeg, png)',
      },
      name: { type: 'string' },
      description: { type: 'string' },
      portions: { type: 'number' },
      minutes: { type: 'number' },
      dificulty: { type: 'number' },
      process: { type: 'string' },
      ingredients: {
        type: 'string',
        description:
          'Lista de ingredientes como JSON string. Ej: [{"name":"Harina","quantity":2,"unit":1}]',
      },
    },
  },
});
