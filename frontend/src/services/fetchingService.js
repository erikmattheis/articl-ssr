import store from "~/store";

const errorAction = "errors/setError";

// Parse the ID from the URL
const getId = (url) => {
  let id = url;

  if (url.charAt(url.length - 1) === "/") {
    id = url.slice(0, Math.max(0, url.length - 1));
  }
  console.log("id", id.slice(Math.max(0, id.lastIndexOf("/") + 1)));
  return id.slice(Math.max(0, id.lastIndexOf("/") + 1));
};
const getDB = (url) => {
  try {
    if (url.includes("pmc")) return "pmc";

    if (url.includes("pubmed.")) return "pubmed";
  } catch (error) {
    store.dispatch(errorAction, error);
  }

  return "";
};
//  Authors as found in Pubmed Data
const extractAuthorsPMC = (element) => {
  if (!element.querySelector("surname")?.textContent) {
    return "";
  }

  let authors = element.querySelector("surname")
    ? `${element.querySelector("surname")?.textContent} `
    : "";

  authors += element.querySelector("given-names")
    ? `${element.querySelector("given-names")?.textContent} `
    : "";

  authors += element.querySelector("degrees")
    ? `${element.querySelector("degrees")?.textContent}<br><br>`
    : "";

  return authors;
};
const extractAuthorsPubMed = (element) => {
  if (!element.querySelector("LastName")?.textContent) {
    return "";
  }

  let authors = "";

  const hasLastName = element.querySelector("LastName")?.textContent;

  authors += hasLastName ? element.querySelector("LastName").textContent : "";

  const hasFirstName = element.querySelector("FirstName")?.textContent;

  authors += hasFirstName
    ? element.querySelector("FirstName").textContent
    : "<br><br>";

  return authors;
};

const extractAuthorsObjectsPubMed = (element) => {
  if (!element.querySelector("LastName")?.textContent) {
    return {};
  }

  let affl = element.querySelectorAll("Affiliation");
  affl = [...affl];

  return {
    nameFirst: element.querySelector("ForeName")
      ? element.querySelector("ForeName")?.textContent
      : "",
    nameLast: element.querySelector("LastName")?.textContent,
    affilliations: affl.map((ele) => ele?.textContent),
  };
};
// Handle the Async fetch of Pubmed Data
const api = async (surl) => {
  const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
  const database = getDB(surl);
  const id = getId(surl);
  const request = new Request(
    `${baseUrl}efetch.fcgi?db=${database}&id=${id}&rettype=abstract&retmode=xml`
  );

  const results = await fetch(request);
  const str = await results.text();
  const responseDocument = new DOMParser().parseFromString(
    str,
    "application/xml"
  );
  const result = {
    authorsOrig: "",
    authors: [],
  };
  console.log("responseDocument", responseDocument);
  switch (database) {
    case "pmc": {
      result.title =
        responseDocument.querySelectorAll("article-title")[0]?.textContent;

      const authorsPMC = responseDocument.querySelectorAll("contrib");

      authorsPMC.forEach((element) => {
        result.authorsOrig += extractAuthorsPMC(element);
      });

      const temporary = responseDocument.querySelectorAll("aff");

      temporary.forEach((element) => {
        result.affiliation += `${element?.textContent}<br><br>`;
      });

      result.journal =
        responseDocument.querySelectorAll("journal-title")[0]?.textContent;

      result.year = responseDocument
        .querySelectorAll("pub-date")[0]
        .querySelectorAll("year")[0]?.textContent;

      result.month = responseDocument
        .querySelectorAll("pub-date")[0]
        .querySelectorAll("month")[0]?.textContent;

      result.abstract =
        responseDocument.querySelectorAll("abstract")[0]?.textContent;

      break;
    }

    case "pubmed": {
      try {
        result.title =
          responseDocument.querySelectorAll("ArticleTitle")[0]?.textContent;
      } catch (error) {
        throw new Error(error);
      }

      result.doi =
        responseDocument.querySelectorAll("[IdType=doi]")[0]?.textContent;

      const authorsPubMed = responseDocument.querySelectorAll("Author");

      authorsPubMed.forEach((element) => {
        result.authors.push(extractAuthorsObjectsPubMed(element));
        result.authorsOrig += extractAuthorsPubMed(element);
      });

      result.affiliation =
        responseDocument.querySelectorAll("Affiliation")[0]?.textContent;

      result.journal =
        responseDocument.querySelectorAll("Title")[0]?.textContent;

      result.year = responseDocument
        .querySelectorAll("PubMedPubDate")[0]
        .querySelectorAll("Year")[0]?.textContent;

      result.month = responseDocument
        .querySelectorAll("PubMedPubDate")[0]
        .querySelectorAll("Month")[0]?.textContent;

      result.abstract =
        responseDocument.querySelectorAll("Abstract")[0]?.textContent;

      break;
    }

    default: {
      throw new Error("Unknown function called in scraper");
    }
  }

  return result;
};

async function scrape(surl) {
  const url = `https://cors-anywhere.herokuapp.com/${surl}`;
  const database = getDB(surl);
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  const responseDocument = parser.parseFromString(html, "text/html");
  const result = {};

  switch (database) {
    case "pmc":
      try {
        result.title = responseDocument.querySelectorAll(
          'h1[class="content-title"]'
        )[0]?.textContent;

        result.authors = responseDocument.querySelectorAll(
          '[class="contrib-group fm-author"]'
        )
          ? responseDocument.querySelectorAll(
              '[class="contrib-group fm-author"]'
            )[0]?.textContent
          : "";

        const temporary =
          responseDocument.querySelectorAll('[class="fm-affl"]');

        temporary.forEach((element) => {
          result.affiliation += `${element?.textContent}<br><br>`;
        });

        result.journal = responseDocument.querySelectorAll(
          'li[class="archive"]'
        )[0]?.textContent;

        result.year = responseDocument.querySelectorAll(
          'li[class="issue-page"]'
        )[0]?.textContent;

        result.abstract =
          responseDocument.querySelectorAll(
            '[class="tsec sec"]'
          )[0]?.textContent;
      } catch (error) {
        throw new Error(error);
      }

      break;

    case "pubmed":
      try {
        result.title = responseDocument.querySelectorAll(
          '[class="heading-title"]'
        )[0]?.textContent;

        result.authors = responseDocument.querySelectorAll(
          '[class="authors-list"]'
        )
          ? responseDocument.querySelectorAll('[class="authors-list"]')[0]
              ?.textContent
          : "";

        result.affiliation = responseDocument.querySelectorAll(
          '[class="affiliations"] ul'
        )[0]?.textContent;

        result.journal = responseDocument.querySelectorAll(
          "#full-view-journal-trigger"
        )[0]?.textContent;

        const yearTry =
          responseDocument.querySelectorAll('span[class="cit"]')[0]
            ?.textContent;

        [result.year] = yearTry.split(" ");

        const monthTry =
          responseDocument.querySelectorAll('span[class="cit"]')[0]
            ?.textContent;

        [, result.month] = monthTry.split(" ");

        result.abstract =
          responseDocument.querySelectorAll("#enc-abstract")[0]?.textContent;
      } catch (error) {
        this.$store.dispatch("errors/setError", error);
      }

      break;

    default:
      throw new Error("Unknown condition passed to scraper.");
  }
}

const download = (filename, text) => {
  const element = document.createElement("a");

  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );

  element.setAttribute("download", filename);

  element.style.display = "none";

  document.body.append(element);

  element.click();

  element.remove();
};
const generateJSON = (result) => {
  const jsonTitle = result.title;
  const jsonAffiliation = result.affiliation;
  const jsonAuthors = result.authors;
  const jsonYear = result.year;
  const jsonMonth = result.month;
  const jsonAbstract = result.abstract;
  const jsonJournal = result.journal;
  const object = {
    title: jsonTitle.replace('"', "'"),
    authors: jsonAuthors.replace('"', "'"),
    affiliation: jsonAffiliation.replace('"', "'"),
    journal: jsonJournal.replace('"', "'"),
    publication_year: jsonYear.replace('"', "'"),
    publication_month: jsonMonth.replace('"', "'"),
    abstract: jsonAbstract.replace('"', "'"),
  };
  const jsonOutput = JSON.stringify(object, null, 2); // TypeError: Converting circular structure to JSON

  // Start file download.
  download(`article_${Date.now()}.json`, jsonOutput);
};
const scraper = (url) => {
  switch (new URL(url).hostname) {
    case "pubmed.ncbi.nlm.nih.gov":
      return api(url);

    case "www.ncbi.nlm.nih.gov":
      return api(url);

    case "pubs.rsna.org":
      return Promise.reject(new Error("pubs.rsna.org not implemented"));

    case "www.ajronline.org":
      return Promise.reject(new Error("www.ajronline.org not implemented"));

    case "www.jultrasoundmed.org":
      return Promise.reject(
        new Error("wwww.jultrasoundmed.org not implemented")
      );

    case "jnm.snmjournals.org":
      return Promise.reject(new Error("jnm.snmjournals.org not implemented"));

    case "www.ajnr.org":
      return Promise.reject(new Error("wwww.ajnr.org not implemented"));

    case "www.jvir.org":
      return Promise.reject(new Error("www.jvir.org not implemented"));

    case "www.youtube.com":
      return Promise.reject(new Error("wwww.youtube.com not implemented"));

    case "journals.aps.org":
      return api(url);

    case "journals.xxxxx.org":
      return scrape(url);

    default:
      return Promise.reject(new Error("Unknown domain: not implemented"));
  }
};
const fetchData = async (url) => scraper(url);

export { fetchData, generateJSON };
