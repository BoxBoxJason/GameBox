import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root_folder_path = dirname(dirname(fileURLToPath(import.meta.url)));

export const db_path = join(root_folder_path,'data','gamebox.db');

export const games_json_path = join(root_folder_path,'data','games.json');

export const static_dir_path = join(root_folder_path,'static');
