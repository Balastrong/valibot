import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  BaseSchema: {
    type: {
      type: 'custom',
      name: 'BaseSchema',
      href: '../BaseSchema/',
      generics: [
        {
          type: 'custom',
          name: 'InstanceType',
          generics: [
            {
              type: 'custom',
              name: 'TClass',
            },
          ],
        },
        {
          type: 'custom',
          name: 'TOutput',
          default: {
            type: 'custom',
            name: 'InstanceType',
            generics: [
              {
                type: 'custom',
                name: 'TClass',
              },
            ],
          },
        },
      ],
    },
  },
  type: {
    type: {
      type: 'string',
      value: 'instance',
    },
  },
  class: {
    type: {
      type: 'custom',
      name: 'TClass',
    },
  },
  message: {
    type: {
      type: 'custom',
      name: 'ErrorMessage',
      href: '../ErrorMessage/',
    },
  },
  pipe: {
    type: {
      type: 'union',
      options: [
        {
          type: 'custom',
          name: 'Pipe',
          href: '../Pipe/',
          generics: [
            {
              type: 'custom',
              name: 'InstanceType',
              generics: [
                {
                  type: 'custom',
                  name: 'TClass',
                },
              ],
            },
          ],
        },
        'undefined',
      ],
    },
  },
};