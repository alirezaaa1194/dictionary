const originTextInput = document.getElementById("origin-text-input");
const translatedTextInput = document.getElementById("translated-text-input");
const saveWordBtn = document.getElementById("save-word-btn");
const openIframeBtn = document.getElementById("open-iframe-btn");
const wordsList = document.getElementById("words-list");
const loaderContainer = document.querySelector(".loader-container");

const cover = document.getElementById("cover");
const iFrame = document.getElementById("iframe");
const categoryLabel = document.getElementById("category-label");
const hideAllWordsBtn = document.querySelector("#hide-allWords-btn");

let allWords = [];
let wordsArray = null;
let search = null;

let isHide = false;

const getWordsFromDB = () => {
  fetch("https://658056126ae0629a3f54f125.mockapi.io/words")
    .then((res) => res.json())
    .then((res) => {
      if (!res.length) {
        location.href = "./index.html";
      }
      if (search === "all-categories") {
        categoryLabel.innerHTML = "همه دسته بندی ها";
        search = res.map((r) => r.id).join("/");
      }
      allWords = res;
      wordsArray = res;

      wordsGenerator();
    });
};

const saveWordInDB = () => {
  search = getLocationSearch("cat").split("/");
  if (originTextInput.value.trim() && translatedTextInput.value.trim()) {
    saveWordBtn.innerHTML = '<div class="btn-loader"></div>';
    let isHaveThisWord = wordsArray.some((word) => word.word === originTextInput.value.trim());

    if (!isHaveThisWord) {
      let newWordInfo = {
        word: originTextInput.value.trim(),
        translated: translatedTextInput.value.trim(),
        markup: "false",
      };

      allWords.forEach((mainWords) => {
        mainWords.words.push(newWordInfo);
      });

      search.forEach((param) => {
        let mainCategoryWords = allWords.find((category) => category.id == param);
        fetch(`https://658056126ae0629a3f54f125.mockapi.io/words/${param}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(mainCategoryWords),
        }).then((res) => {
          search = getLocationSearch("cat");
          getWordsFromDB();
          saveWordBtn.innerHTML = "ذخیره";
        });
      });

      originTextInput.value = "";
      translatedTextInput.value = "";
    } else {
      originTextInput.value = "";
      translatedTextInput.value = "";
      saveWordBtn.innerHTML = "ذخیره";
      alert("این کلمه از قبل وجود دارد");
    }
  }
};

const wordsGenerator = () => {
  if (search === "all-categories") {
    // wordsArray = wordsArray.flatMap((data) => data.words);

    categoryLabel.innerHTML = "همه دسته بندی ها";
  } else {
    let wordsInCategory = [];

    let params = search.split("/");

    params.forEach((param) => {
      wordsInCategory.push(wordsArray.find((category) => category.id == param));
    });

    allWords = wordsInCategory;
    
    if (!allWords[0] || allWords.includes(undefined)) {
      location.href = "./index.html";
    }

    wordsArray = wordsInCategory?.flatMap((data) => data.words);

    if (!categoryLabel.innerHTML) {
      allWords.forEach((cats) => (categoryLabel.innerHTML += cats.categoryName + ", "));
      categoryLabel.innerHTML = categoryLabel.innerHTML.substr(0, categoryLabel.innerHTML.length - 2);
    }
  }

  wordsList.innerHTML = "";

  hideAllWordsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>`;

  if (wordsArray.length) {
    let isRandom = new URLSearchParams(location.href).get("random");
    if (isRandom) {
      wordsArray
        .sort(() => 0.5 - Math.random())
        .forEach((word, index) => {
          wordsList.insertAdjacentHTML(
            "beforeend",
            `<li class="${JSON.parse(word.markup) ? "list-markup" : ""}">
        <span>${index + 1}_ ${word.word}: 
            <span class="translted-txt translted-txt-${word.word.split(" ").join("")}">${word.translated}</span>
        </span>
        
        <div>
      
            <button class="hide-translted-btn" id="${word.word.split(" ").join("")}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>

        </button>


        <button class="markup-word-btn" id="${word.word.split(" ").join("")}">
${
  JSON.parse(word.markup)
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="solid-markup-svg">
  <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
</svg>
`
    : `

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
   `
}     
        </button>
            <button class="remove-word-btn" id="${word.word.split(" ").join("")}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
            </svg>
            </button>
        </div>
      </li>`
          );
        });
    } else {
      wordsArray.forEach((word, index) => {
        wordsList.insertAdjacentHTML(
          "beforeend",
          `<li class="${JSON.parse(word.markup) ? "list-markup" : ""}">
        <span>${index + 1}_ ${word.word}: 
            <span class="translted-txt translted-txt-${word.word.split(" ").join("")}">${word.translated}</span>
        </span>
        
        <div>
      
            <button class="hide-translted-btn" id="${word.word.split(" ").join("")}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>

        </button>


        <button class="markup-word-btn" id="${word.word.split(" ").join("")}">
${
  JSON.parse(word.markup)
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="solid-markup-svg">
  <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
</svg>
`
    : `

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
   `
}     
        </button>
            <button class="remove-word-btn" id="${word.word.split(" ").join("")}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
            </svg>
            </button>
        </div>
      </li>`
        );
      });
    }

    let removeWordBtns = document.querySelectorAll(".remove-word-btn");
    let hideWordBtns = document.querySelectorAll(".hide-translted-btn");
    let markupWordBtns = document.querySelectorAll(".markup-word-btn");

    removeWordBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        removeWordHandler(btn);
      })
    );

    hideWordBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        const mainBtn = document.querySelector(`.translted-txt-${btn.id}`);
        mainBtn.classList.toggle("hide");

        if (mainBtn.className.includes("hide")) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="color:black;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`;
        } else {
          //پنهان
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>
`;
          hideAllWordsBtn.classList.remove("hide");
          hideAllWordsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>`;
        }
      })
    );

    markupWordBtns.forEach((markupBtn) => {
      markupBtn.addEventListener("click", () => {
        let mainWord = wordsArray.find((word) => word.word === markupBtn.id);

        const wordId = markupBtn.id;

        let mainCategories = allWords.filter((category) => category.words.some((word) => word.word.split(" ").join("") == wordId));

        mainCategories.forEach((cat) => {
          let wordsInAllWords = cat.words.find((word) => word.word === mainWord.word);

          wordsInAllWords.markup = JSON.stringify(!JSON.parse(wordsInAllWords.markup));

          fetch(`https://658056126ae0629a3f54f125.mockapi.io/words/${cat.id}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(cat),
          }).then(() => {
            getWordsFromDB();
          });
        });
      });
    });
  } else {
    wordsList.insertAdjacentHTML("beforeend", `<li class="nothing"><h2>هیچ کلمه ای نیست!</h2></li>`);
  }

  loaderContainer.classList.add("hide");
};

hideAllWordsBtn.addEventListener("click", () => {
  let hideWordBtns = document.querySelectorAll(".hide-translted-btn");
  let mainBtn = null;

  if (!isHide) {
    hideAllWordsBtn.classList.add("hide");
    isHide = true;
  } else {
    hideAllWordsBtn.classList.remove("hide");
    isHide = false;
  }

  hideWordBtns.forEach((hideBtn, index) => {
    mainBtn = document.querySelector(`.translted-txt-${hideBtn.id}`);

    if (hideAllWordsBtn.className.includes("hide")) {
      hideBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="color:black;">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>`;
      mainBtn.classList.add("hide");
    } else {
      hideBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>`;
      mainBtn.classList.remove("hide");
    }
  });

  if (hideAllWordsBtn.className.includes("hide")) {
    hideAllWordsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="color:black;">
<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>`;
  } else {
    hideAllWordsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>`;
  }
});

saveWordBtn.addEventListener("click", () => {
  saveWordInDB();
});

const removeWordHandler = (btn) => {
  const wantRemove = confirm("آیا کلمه را حذف میکنید؟");
  const wordId = btn.id;

  let mainCategories = allWords.filter((category) => category.words.find((word) => word.word.split(" ").join("") == wordId));

  if (wantRemove) {
    mainCategories.forEach((cat) => {
      cat.words = cat.words.filter((word) => word.word.split(" ").join("") !== wordId);
      fetch(`https://658056126ae0629a3f54f125.mockapi.io/words/${cat.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(cat),
      }).then(() => {
        getWordsFromDB();
      });
    });
  }
};

originTextInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    translatedTextInput.focus();
  }
});
translatedTextInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    saveWordInDB();
    originTextInput.focus();
  }
});

openIframeBtn.addEventListener("click", () => {
  cover.classList.add("show");
  iframe.classList.add("show");
});
cover.addEventListener("click", () => {
  cover.classList.remove("show");
  iframe.classList.remove("show");
});

const getLocationSearch = (key) => {
  let search = new URLSearchParams(location.search).get(key);
  return search;
};

window.addEventListener("load", () => {
  search = getLocationSearch("cat");
  if (!search) {
    location.href = "./index.html";
  }
  getWordsFromDB();
});
