document.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.getItem("card")) {
		let data = [
			{
				id: 1,
				numberTask: 120,
				message: "Подготовить коммерческое предложение",
				price: 250,
				status: "success"
			},
			{
				id: 2,
				numberTask: 220,
				message: "Созвон с потенциальным клиентом ",
				price: 150,
				status: "comm"
			},
			{
				id: 3,
				numberTask: 880,
				message: "Проанализировать конкурентов",
				price: 50,
				status: "process"
			},
			{
				id: 4,
				numberTask: 1120,
				message: "Проверить выполнение KPI за месяц",
				price: 86,
				status: "warn"
			},
			{
				id: 5,
				numberTask: 201,
				message: "Настроить воронку продаж",
				price: 500,
				status: "comm"
			},
			{
				id: 6,
				numberTask: 245,
				message: "Запустить рекламную кампанию",
				price: 158,
				status: "process"
			},
			{
				id: 7,
				numberTask: 350,
				message: "Согласовать условия сделки",
				price: 202,
				status: "comm"
			}
		];

		localStorage.setItem("card", JSON.stringify(data));
	}

	const zonesArea = document.querySelectorAll(".gragon-zone");
	let elementTask = JSON.parse(localStorage.getItem("card"));
	renderTasks();

	function updateFiled(parent, el, type, attrClass) {
		try {
			let element = parent.querySelector(`.${el}`);
			parent.querySelector(".task__text").textContent = "";
			parent.querySelector(".card__CRUD").style.opacity = 0;

			let containerEdit = document.createElement("div");
			containerEdit.className = "card__updatefield";
			containerEdit.setAttribute("data-old-class", attrClass);

			let btnSave = document.createElement("button");
			btnSave.className = "button__save--input";
			btnSave.textContent = "";

			let inputElement = document.createElement("input");
			inputElement.setAttribute("type", type);
			inputElement.className = "card__input";

			let value = deleteDollar(element);

			inputElement.value = value;
			containerEdit.append(inputElement, btnSave);
			element.replaceWith(containerEdit);
		} catch (error) {}
	}
	function saveUpdateFiled(parent, attrClass, id, e) {
		let elementInput = parent.querySelector(".card__input");
		let buttonSave = parent.querySelector(".button__save--input");
		let elementNew = document.createElement("div");
		let card = e.target.closest(".card");
		// console.log(card.querySelectorAll(".card__updatefield").length == 0);

		if (card.querySelectorAll(".card__updatefield").length == 1) {
			card.querySelector(".task__text").textContent = "Задача";
			card.querySelector(".card__CRUD").style.opacity = 1;
		}

		let value = {};
		const elementId = id;

		elementNew.className = attrClass;
		elementNew.setAttribute("data-edit", "true");
		buttonSave.classList.add("button__save--none");
		elementNew.textContent = attrClass.includes("price")
			? (elementInput.value += "$")
			: elementInput.value;
		parent.replaceWith(elementNew);

		if (elementNew.classList.contains("card__numberTask")) {
			value.numberTask = elementNew.textContent;
		} else if (elementNew.classList.contains("card__text")) {
			value.message = elementNew.textContent;
		} else if (elementNew.classList.contains("card__price")) {
			value.price = elementNew.textContent;
		}

		updateLocalStorage(elementId, value, attrClass);
	}
	function updateLocalStorage(id, data, attrClass) {
		elementTask.map((el) => {
			if (el.id == id) {
				if (attrClass.includes("price")) {
					el.price = Number(data.price.replace("$", "")) || el.price;
				} else if (attrClass.includes("numberTask")) {
					el.numberTask = Number(data.numberTask) || el.numberTask;
				} else if (
					attrClass.includes("text") ||
					attrClass.includes("message")
				) {
					el.message = data.message || el.message;
				}
			}
			return el;
		});
		localStorage.setItem("card", JSON.stringify(elementTask));
	}
	function deleteDollar(element) {
		let normalPropirty = element.textContent.trim().includes("$")
			? element.textContent
					.trim()
					.slice(0, element.textContent.trim().length - 1)
			: element.textContent.trim();
		return normalPropirty;
	}
	function determinantIsNAN(element) {
		return isNaN(Number(element)) ? "string" : "number";
	}
	//! modal -----------------------------------------------
	const open = document.querySelector(".open");
	const modal = document.querySelector(".modal");
	const modaOverlay = document.querySelector(".modal__overlay");
	const close = document.querySelector(".close");
	let isOpen = false;
	open.addEventListener("click", () => {
		if (!isOpen) {
			modal.style.display = "block";
			modal.style.opacity = 0;

			requestAnimationFrame(() => {
				modal.style.opacity = 1;
			});
			document.documentElement.style.overflow = "hidden";
			close.focus();
			isOpen = true;
		}
	});
	close.addEventListener("click", () => {
		closeModal(1000);
	});
	modaOverlay.addEventListener("click", () => {
		closeModal(1000);
	});

	function closeModal(timer = 1000) {
		requestAnimationFrame(() => {
			modal.style.opacity = 0;

			setTimeout(() => {
				modal.style.display = "none";
				document.documentElement.style.overflow = "auto";
				isOpen = false;
			}, timer);
		});
	}

	document.addEventListener("keydown", (e) => {
		if (e.key == "Escape" && isOpen) {
			closeModal(1000);
		}
	});

	//! form

	const formAddTask = document.querySelector(".form-add-task");
	const btnFormAddTask = formAddTask.querySelector("input[type=submit]");
	formAddTask.addEventListener("submit", (e) => {
		e.preventDefault();
		// console.log(formAddTaskData);
		const formAddTaskData = new FormData(formAddTask);
		let dataForLocal = {};
		dataForLocal.id = elementTask.length + 1;
		dataForLocal.numberTask = formAddTaskData.get("numberTask");
		dataForLocal.message = formAddTaskData.get("message");
		dataForLocal.price = formAddTaskData.get("price");
		dataForLocal.status = formAddTaskData.get("select");
		if (dataForLocal) {
			elementTask.push(dataForLocal);
			localStorage.setItem("card", JSON.stringify(elementTask));
			formAddTask.reset();
			btnFormAddTask.disabled = true;
			closeModal(1000);
			renderTasks();
		}
	});
	formAddTask.addEventListener("input", (e) => {
		// const data = new FormData(formAddTask);
		const formAddTaskData = new FormData(formAddTask);
		let hasSubmit = false;
		try {
			formAddTaskData.forEach((item, key) => {
				let errorLive = formAddTask.querySelector(`.${key}-error`);

				errorLive.textContent = "";

				if (!item.trim()) {
					errorLive.textContent = "Поле не должно быть пустым";
					hasSubmit = true;
					return;
				}
				if (key === "numberTask") {
					let value = Number(item);
					if (Number.isNaN(value)) {
						errorLive.textContent = "";
						hasSubmit = true;
						return;
					}

					if (item.length < 3 || item.length > 8) {
						errorLive.textContent = "Номер задачи должен быть от 3 до 8 цифр";
						hasSubmit = true;
						return;
					}
				}
				if (key === "message") {
					if (item.length < 10) {
						errorLive.textContent = "Сообщения должно быть больше 10 символов";
						hasSubmit = true;
						return;
					}
				}
				if (key === "price") {
					let value = Number(item);
					if (Number.isNaN(value)) {
						errorLive.textContent = "Введите цену цифрами";
						hasSubmit = true;
						return;
					}
				}
			});
			btnFormAddTask.disabled = hasSubmit;
		} catch (error) {
			console.error(error);
		}
	});

	function createDomCard(numberTask, message, price) {
		const card = document.createElement("div");
		card.classList.add("card");

		const cardTitle = document.createElement("div");
		cardTitle.className = "card__title";
		cardTitle.innerHTML = ` <span class='task__text'>Задача</span> <span class='card__numberTask' data-edit="false">  ${numberTask}</span> <span class="card__CRUD">
                            <span class="card__update" data-edit-status=false><img src="./icons/edit.svg" alt="" srcset=""></span>
                            <span class="card__delete"><img src="./icons/trash.svg" alt="" srcset=""></span></span>`;
		const cardText = document.createElement("p");
		cardText.className = "card__text ";
		cardText.setAttribute("data-edit", false);
		cardText.textContent = message;
		const cardPrice = document.createElement("div");
		cardPrice.className = "card__price price";
		cardPrice.setAttribute("data-edit", false);
		cardPrice.textContent = price + "$";
		card.append(cardTitle, cardText, cardPrice);
		return card;
	}

	//!  dragon-drop -----------------------------------------------------

	const zones = document.querySelectorAll(".gragon-zone__container");
	let dragoned = null;

	document.addEventListener("mousemove", (e) => {
		if (!dragoned) return;

		let hovered = document.elementFromPoint(e.clientX, e.clientY);

		if (!hovered) return;

		let targetCard = hovered.closest(".card");

		zones.forEach((zone) => {
			if (!zone.children.length) {
				let p = document.createElement("p");
				p.classList.add("p-empty");
				p.textContent = "пусто";
				zone.append(p);
			} else if (zone.children.length > 1) {
				zone.querySelector(".p-empty")?.remove();
			}

			if (
				zone.contains(hovered) &&
				!targetCard &&
				dragoned &&
				zone !== dragoned.parentElement
			) {
				zone.appendChild(dragoned);
				// console.log(zone.parentElement.getAttribute("data-status"));
				// console.log(dragoned.id);
				// console.log(elementTask);

				elementTask = elementTask.map((el) => {
					if (el.id == dragoned.getAttribute("data-id")) {
						return {
							...el,
							status: zone.parentElement.getAttribute("data-status")
						};
					}
					return el;
				});
				localStorage.setItem("card", JSON.stringify(elementTask));
			}
			if (targetCard && targetCard !== dragoned && zone.contains(targetCard)) {
				let rect = targetCard.getBoundingClientRect();
				let isAbove = e.clientY < rect.top + rect.height / 2;

				if (isAbove) {
					zone.insertBefore(dragoned, targetCard);
				} else {
					zone.insertBefore(dragoned, targetCard.nextElementSibling);
				}
			}

			let leng = zone.closest(".gragon-zone").querySelector(".leng");
			if (
				zone.children.length == 1 &&
				zone.children[0].classList.contains("p-empty")
			) {
				leng.textContent = 0;
			} else {
				leng.textContent = zone.children.length;
			}
		});
	});
	document.addEventListener("mouseup", () => {
		if (dragoned) {
			dragoned.classList.remove("active");
			dragoned = null;
		}
	});
	function renderTasks() {
		zonesArea.forEach((zone) => {
			// !!!
			zone.querySelector(".gragon-zone__container").textContent = "";
			elementTask.forEach((elem) => {
				if (zone.getAttribute("data-status").trim() == elem.status.trim()) {
					let result = createDomCard(elem.numberTask, elem.message, elem.price);
					result.setAttribute("data-id", elem.id);
					zone.querySelector(".gragon-zone__container").append(result);
				}

				// }
			});

			zone.addEventListener("click", (e) => {
				try {
					let item = e.target.closest(".gragon-zone");
					if (!item) return; // защита от null
					if (item.classList.contains("gragon-zone-sum")) {
						item.classList.add("hide-sum");

						// удалим основной класс после завершения анимации
						setTimeout(() => {
							item.classList.remove("gragon-zone-sum");
							item.classList.remove("hide-sum"); // чистим
						}, 500); // врем
					}
				} catch (error) {
					console.error(error);
				}
			});
			attachDragListeners();
			attachCardCRUDListeners();
			updateStaticData();
		});
	}
	function attachDragListeners() {
		document.querySelectorAll(".card").forEach((card) => {
			card.addEventListener("pointerdown", (e) => {
				dragoned = card;
				card.classList.add("active");
			});

			card.addEventListener("click", (e) => {
				if (e.target.classList.contains("card__text")) {
					if (e.target.classList.contains("active")) {
						e.target.classList.remove("active");
						e.target.style.maxHeight = "35px";
					} else {
						e.target.classList.add("active");
						e.target.style.maxHeight = e.target.scrollHeight + "px";
					}

					e.stopPropagation();
				}
			});

			card.addEventListener("mouseout", (e) => {
				if (e.target.classList.contains("card__text")) {
					timerIdForTextCard = setTimeout(() => {
						e.target.classList.remove("active");
						e.target.style.maxHeight = "35px";
					}, 10000);
				}
			});
		});
	}
	function attachCardCRUDListeners() {
		document.querySelectorAll(".card").forEach((card) => {
			card.addEventListener("click", (e) => {
				const cardItem = e.target.closest(".card");
				if (!cardItem) return;
				if (e.target.classList.contains("card__delete")) {
					const id = cardItem.getAttribute("data-id");
					cardItem.remove();
					elementTask = elementTask.filter((item) => item.id != id);
					localStorage.setItem("card", JSON.stringify(elementTask));
				}

				if (e.target.classList.contains("card__update")) {
					const dataEditAttr = cardItem.querySelectorAll("[data-edit]");
					dataEditAttr.forEach((attr) => {
						let attrClass = attr.className.split(" ")[0];
						let normalPropirty = deleteDollar(attr);
						let attrTypeFiled = determinantIsNAN(normalPropirty);
						updateFiled(cardItem, attrClass, attrTypeFiled, attr.className);
					});
				}

				if (e.target.classList.contains("button__save--input")) {
					const updateFieldItem = e.target.closest(".card__updatefield");
					const listClassField = updateFieldItem.getAttribute("data-old-class");
					const parentId = e.target.closest(".card").getAttribute("data-id");

					saveUpdateFiled(updateFieldItem, listClassField, parentId, e);
				}
			});
		});
	}
	function updateStaticData() {
		const zones = document.querySelectorAll(".gragon-zone");

		zones.forEach((zone) => {
			const container = zone.querySelector(".gragon-zone__container");
			const cards = container.querySelectorAll(".card");

			// Обновление количества задач
			const lengEl = zone.querySelector(".leng");
			if (lengEl) lengEl.textContent = cards.length;

			// Суммирование цен
			let prices = Array.from(container.querySelectorAll(".price")).map((el) =>
				Number(el.textContent.replace("$", ""))
			);

			const sum = prices.reduce((acc, val) => acc + val, 0);

			zone.setAttribute("data-sum", sum);
			zone.setAttribute("data-count", prices.length);
		});
	}
	document.querySelectorAll(".gragon-zone").forEach((zone) => {
		zone.addEventListener("click", (e) => {
			if (e.target.classList.contains("static")) {
				const item = e.currentTarget;
				const sum = item.getAttribute("data-sum");
				const count = item.getAttribute("data-count");

				item.classList.add("gragon-zone-sum");
				item.setAttribute("title", `Всего: ${sum}₽, задач: ${count}`);

				setTimeout(() => {
					item.classList.remove(".hide-sum");
					item.removeAttribute("title");
				}, 1500);
			}
		});
	});
});
