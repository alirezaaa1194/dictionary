const originTextInput = document.getElementById("origin-text-input");
const translatedTextInput = document.getElementById("translated-text-input");
const saveWordBtn = document.getElementById("save-word-btn");
const openIframeBtn = document.getElementById("open-iframe-btn");
const wordsList = document.getElementById("words-list");
const loaderContainer = document.querySelector(".loader-container");

const cover = document.getElementById("cover");
const iFrame = document.getElementById("iframe");
const categoryLabel = document.getElementById("category-label");

let allWords = [];
let wordsArray = null;
let search = null;

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
    wordsArray = wordsArray.flatMap((data) => data.words);
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
      categoryLabel.innerHTML=categoryLabel.innerHTML.substr(0, categoryLabel.innerHTML.length - 2)
    }
  }
  wordsList.innerHTML = "";

  if (wordsArray.length) {
    wordsArray
      .sort(() => 0.5 - Math.random())
      .forEach((word, index) => {
        wordsList.insertAdjacentHTML(
          "beforeend",
          `<li>
        <span>${index + 1}_ ${word.word}: 
            <span class="translted-txt translted-txt-${word.word}">${word.translated}</span>
        </span>
        
        <div>
            <button class="hide-translted-btn" id="${word.word}">پنهان</button>
            <button class="remove-word-btn" id="${word.word}">حذف</button>
        </div>
      </li>`
        );
      });

    let removeWordBtns = document.querySelectorAll(".remove-word-btn");
    let hideWordBtns = document.querySelectorAll(".hide-translted-btn");
    let hideAllWordsBtn = document.querySelector("#hide-allWords-btn");

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
          btn.innerHTML = "نمایش";
        } else {
          btn.innerHTML = "پنهان";
          hideAllWordsBtn.classList.remove("hide");
          hideAllWordsBtn.innerHTML = "پنهان همه";
        }
      })
    );

    hideAllWordsBtn.addEventListener("click", () => {
      let mainBtn = null;

      hideAllWordsBtn.classList.toggle("hide");

      hideWordBtns.forEach((hideBtn, index) => {
        mainBtn = document.querySelector(`.translted-txt-${hideBtn.id}`);

        if (hideAllWordsBtn.className.includes("hide")) {
          hideBtn.innerHTML = "نمایش";
          mainBtn.classList.add("hide");
        } else {
          hideBtn.innerHTML = "پنهان";
          mainBtn.classList.remove("hide");
        }
      });

      if (hideAllWordsBtn.innerHTML === "پنهان همه") {
        hideAllWordsBtn.innerHTML = "نمایش همه";
      } else {
        hideAllWordsBtn.innerHTML = "پنهان همه";
      }
    });
  } else {
    wordsList.insertAdjacentHTML("beforeend", `<li class="nothing"><h2>هیچ کلمه ای نیست!</h2></li>`);
  }

  loaderContainer.classList.add("hide");
};

saveWordBtn.addEventListener("click", () => {
  saveWordInDB();
});

const removeWordHandler = (btn) => {
  const wantRemove = confirm("آیا کلمه را حذف میکنید؟");
  const wordId = btn.id;

  let mainCategories = allWords.filter((category) => category.words.find((word) => word.word == wordId));

  if (wantRemove) {
    btn.innerHTML = '<div class="btn-loader"></div>';
    mainCategories.forEach((cat) => {
      cat.words = cat.words.filter((word) => word.word !== wordId);
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
