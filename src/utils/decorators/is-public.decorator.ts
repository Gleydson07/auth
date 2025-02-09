import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = '16995eef256269cfe8804ffaf770cb4b';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
