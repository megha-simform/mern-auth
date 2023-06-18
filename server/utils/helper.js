import * as bcrypt from 'bcrypt';
import 'dotenv/config';

import { saltOrRounds } from '../common/constants.js';

/**
 ** Creates a hash of the provided password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @returns {string} The generated hash.
 */
export const createHash = (password) => bcrypt.hashSync(password, saltOrRounds);
