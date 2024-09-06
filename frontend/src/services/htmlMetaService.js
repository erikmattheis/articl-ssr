import store from "~/store";

const setTitle = (titleHtml) => {
  document.title = titleHtml;
};
const setMetaDescription = (metaDescription) => {
  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement("meta");

    meta.name = "description";

    document
      .getElementsByTagName("head")[0]
      .appendChild(meta)
      .setAttribute("content", metaDescription);
  } else {
    meta.content = metaDescription;
  }
};
const setTitleAndDescription = (category) => {
  setTitle(category.titleHtml);

  setMetaDescription(category.description);

  store.dispatch("metas/setMetaDescriptionAndDocumentTitle", {
    titleHtml: category.titleHtml,
    description: category.description,
  });
};

export { setMetaDescription, setTitle, setTitleAndDescription };
