const categoriesSection = document.querySelector(".categories-section");

const accordion = document.querySelector(".accordion");
const accordionHeader = document.querySelector(".accordion-header");
const accordionBody = document.querySelector(".accordion-body");

const categoriesItem = document.querySelector(".categories-item");
const categoriesContainer = document.querySelector(".categories-container");

const loaderContainer = document.querySelector(".loader-container");

const categoryTextInput = document.querySelector("#category-text-input");
const saveCategoryBtn = document.querySelector("#save-category-btn");
const cancelCategoryBtn = document.querySelector("#cancel-category-btn");
const saveCategoriesChangeBtn = document.querySelector("#save-categories-change-btn");
const allCategoriesCheckbox = document.querySelector("#all-categories");
const randomSettingBox = document.querySelector(".random-setting-box");
const randomWordCheckbox = document.querySelector("#random-word-checkbox");


let allCategories = [];

let isEditing = false;
let mainCategory = {};

let categoriesId = [];

accordionHeader.addEventListener("click", () => {
  accordion.classList.toggle("active");
  if (accordion.className.includes("active")) {
    accordionBody.style.height = accordionBody.scrollHeight + "px";
  } else {
    accordionBody.style.height = "0px";
    accordionBody.style.overflow = "hidden";
  }
});

const getCategories = async () => {
  const res = await fetch("https://658056126ae0629a3f54f125.mockapi.io/words");
  const datas = await res.json();

  allCategories = datas;
  categoriesGenerator(datas);
};

const categoriesGenerator = (categories) => {
  if (categories.length) {
    categories.forEach((category) => {
      categoriesItem.insertAdjacentHTML(
        "beforeend",
        `
            <div class="accordion-item">
              <input type="checkbox" class="categories-checkbox" id="${category.id}" />
              <label for="${category.id}">${category.categoryName}</label>
            </div>
            `
      );
      categoriesContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="category">
          <span class="category-link-btn">${category.categoryName}</span>
          <span>
          <button class="category-delete-btn" id="${category.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>

          </button>
          <button class="category-edit-btn" id="${category.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          </span>
        </div>`
      );
    });


    const categoryLinkBtns=document.querySelectorAll('.category-link-btn')
    categoryLinkBtns.forEach((btn, index)=>{
      btn.addEventListener('click', ()=>{
        location.href=`./words.html?cat=${categories[index].id}${randomWordCheckbox.checked ? `&random=${randomWordCheckbox.checked}` : ""}`

      })
    })

    const categoriesCheckboxs = document.querySelectorAll(".categories-checkbox");
    const categoryEditBtns = document.querySelectorAll(".category-edit-btn");
    const categoryDeleteBtns = document.querySelectorAll(".category-delete-btn");

    categoriesCheckboxs.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          categoriesId.push(checkbox.id);
        } else {
          categoriesId = categoriesId.filter((category) => category != checkbox.id);
        }

        if (checkbox.id !== allCategoriesCheckbox.id) {
          if (categoriesId.length === allCategories.length && !allCategoriesCheckbox.checked) {
            allCategoriesCheckbox.checked = true;
            categoriesId = [];
            categoriesId = [allCategoriesCheckbox.id];
          } else {
            allCategoriesCheckbox.checked = false;
            categoriesId = [];

            categoriesCheckboxs.forEach((checkbox) => {
              if (checkbox.checked) {
                categoriesId.push(checkbox.id);
              }
            });
          }
        }
      });
    });

    categoryEditBtns.forEach((editBtn) => {
      editBtn.addEventListener("click", () => {
        isEditing = true;
        mainCategory = allCategories.find((category) => category.id == editBtn.id);

        randomSettingBox.classList.add("hide");
        editBtn.classList.add("active");

        categoryTextInput.setAttribute("placeholder", `نام کتگوری را ویرایش کنید`);
        categoryTextInput.value = mainCategory.categoryName;
        saveCategoryBtn.innerHTML = "ویرایش";
        cancelCategoryBtn.classList.add("active");
      });
    });

    categoryDeleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", () => {
        mainCategory = allCategories.find((category) => category.id == deleteBtn.id);
        let isDelete = confirm(`آیا کتگوری ${mainCategory.categoryName} را حذف میکنید؟`);
        if (isDelete) {
          fetch(`https://658056126ae0629a3f54f125.mockapi.io/words/${mainCategory.id}`, {
            method: "DELETE",
          }).then((res) => {
            if (res.status == 200) {
              location.reload();
            }
          });
        } else {
          mainCategory = {};
        }
      });
    });
  } else {
    categoriesSection.remove();
    document.body.insertAdjacentHTML("beforeend", `<h2 class="nothing">هیچ کلمه ای نیست!</h2>`);
  }
  loaderContainer.classList.add("hide");
};

cancelCategoryBtn.addEventListener("click", () => {
  isEditing = false;
  mainCategory = {};

  categoryTextInput.value = "";
  categoryTextInput.setAttribute("placeholder", `نام کتگوری را وارد کنید`);
  saveCategoryBtn.innerHTML = "ذخیره";
  cancelCategoryBtn.classList.remove("active");
  randomSettingBox.classList.remove("hide");
  const categoryEditBtns = document.querySelectorAll(".category-edit-btn");
  categoryEditBtns.forEach((editBtn) => {
    editBtn.classList.remove("active");
  });
});

saveCategoryBtn.addEventListener("click", () => {
  if (isEditing) {
    if (categoryTextInput.value.trim()) {
      mainCategory.categoryName = categoryTextInput.value.trim();
      fetch(`https://658056126ae0629a3f54f125.mockapi.io/words/${mainCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mainCategory),
      }).then((res) => {
        if (res.status == 200) {
          location.reload();
        }
      });
    }
  } else {
    if (categoryTextInput.value.trim()) {
      fetch(`https://658056126ae0629a3f54f125.mockapi.io/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: categoryTextInput.value.trim(),
          words: [],
        }),
      }).then((res) => {
        if (res.status == 201) {
          location.reload();
        }
      });
    }
  }
});
/////////////////////////////////////////
allCategoriesCheckbox.addEventListener("change", () => {
  const categoriesCheckboxs = document.querySelectorAll(".categories-checkbox");
  categoriesCheckboxs.forEach((checkbox) => {
    checkbox.checked = allCategoriesCheckbox.checked;
  });
  categoriesId = [];
});
saveCategoriesChangeBtn.addEventListener("click", () => {
  location.href=`./words.html?cat=${categoriesId.join("/")}${randomWordCheckbox.checked ? `&random=${randomWordCheckbox.checked}` : ""}`
  
});

window.addEventListener("load", () => {
  getCategories();
});
