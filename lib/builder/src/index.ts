import { createBuilder } from '@angular-devkit/architect';

import { builder } from './builder';
import type { BuilderOptions } from './schema';

export default createBuilder<BuilderOptions>(builder);
