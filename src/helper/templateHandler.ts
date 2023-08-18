import fs from 'fs';
import handleBars from 'handlebars';
import path from 'path';

const getTemplate = (fileName: string, payload: Record<string, any> | null) => {
  const source = fs
    .readFileSync(path.join(__dirname, `../templates/${fileName}`), 'utf-8')
    .toString();

  const template = handleBars.compile(source);
  return template(payload);
};
export default getTemplate;
