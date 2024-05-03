//=====================find document//=====================//
export const findDocument = async (model, query) => {
  if (!model || !query) {
    return { message: "invalid arguments", status: 400, success: false };
  }
  const isDocumentExists = await model.findOne(query);
  if (!isDocumentExists)
    return { message: "document not found", status: 404, success: false };
  return { message: "document found", isDocumentExists, success: true };
};

//=====================create document//=====================//
export const createDocument = async (model, data) => {
  if (!model || !data) {
    return { message: "invalid arguments", status: 400, success: false };
  }
  const createdDocument = await model.create(data);
  if (!createdDocument)
    return { message: "document didn't create", status: 400, success: false };
  return {
    message: "document created successfully!",
    createdDocument,
    success: true,
    status: 201,
  };
};

//=====================delete document//=====================//
export const deleteDocument = async (model, query) => {
  if (!model || !query) {
    return { message: "invalid arguments", status: 400, success: false };
  }
  const deletedDocument = await model.findOneAndDelete(query);
  if (!deletedDocument)
    return { message: "document cann't delete", status: 400, success: false };
  return {
    message: "document deleted successfuly!",
    deletedDocument,
    success: true,
    status: 200,
  };
};
