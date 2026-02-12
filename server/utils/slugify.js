import slugify from "slugify";

export default (text) =>
  slugify(text, { lower: true, strict: true, trim: true });
