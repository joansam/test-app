import { c as create_ssr_component, h as each, e as escape, d as add_attribute, i as null_to_empty } from "../../../chunks/index.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "form.svelte-wk2j3k.svelte-wk2j3k{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;flex:1}.how-to-play.svelte-wk2j3k.svelte-wk2j3k{color:var(--color-text)}.how-to-play.svelte-wk2j3k.svelte-wk2j3k::before{content:'i';display:inline-block;font-size:0.8em;font-weight:900;width:1em;height:1em;padding:0.2em;line-height:1;border:1.5px solid var(--color-text);border-radius:50%;text-align:center;margin:0 0.5em 0 0;position:relative;top:-0.05em}.grid.svelte-wk2j3k.svelte-wk2j3k{--width:min(100vw, 40vh, 380px);max-width:var(--width);align-self:center;justify-self:center;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-start}.grid.svelte-wk2j3k .row.svelte-wk2j3k{display:grid;grid-template-columns:repeat(5, 1fr);grid-gap:0.2rem;margin:0 0 0.2rem 0}.grid.bad-guess.svelte-wk2j3k .row.current.svelte-wk2j3k{animation:svelte-wk2j3k-wiggle 0.5s}.grid.playing.svelte-wk2j3k .row.current.svelte-wk2j3k{filter:drop-shadow(3px 3px 10px var(--color-bg-0))}input.svelte-wk2j3k.svelte-wk2j3k{aspect-ratio:1;width:100%;display:flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box;text-transform:lowercase;border:none;font-size:calc(0.08 * var(--width));border-radius:2px;background:white;margin:0;color:rgba(0, 0, 0, 0.7)}input.svelte-wk2j3k.svelte-wk2j3k:disabled:not(.exact):not(.close){background:rgba(255, 255, 255, 0.5);color:rgba(0, 0, 0, 0.5)}input.exact.svelte-wk2j3k.svelte-wk2j3k{background:var(--color-theme-2);color:white}input.close.svelte-wk2j3k.svelte-wk2j3k{border:2px solid var(--color-theme-2)}input.svelte-wk2j3k.svelte-wk2j3k:focus{outline:none}[aria-selected='true'].svelte-wk2j3k.svelte-wk2j3k{outline:2px solid var(--color-theme-1)}input.svelte-wk2j3k.svelte-wk2j3k:not(:disabled)::selection{background:transparent;color:var(--color-theme-1)}.controls.svelte-wk2j3k.svelte-wk2j3k{text-align:center;justify-content:center;height:min(18vh, 10rem)}.keyboard.svelte-wk2j3k.svelte-wk2j3k{--gap:0.2rem;position:relative;display:flex;flex-direction:column;gap:var(--gap);height:100%}.keyboard.svelte-wk2j3k .row.svelte-wk2j3k{display:flex;justify-content:center;gap:0.2rem;flex:1}.keyboard.svelte-wk2j3k button.svelte-wk2j3k,.keyboard.svelte-wk2j3k button.svelte-wk2j3k:disabled{--size:min(8vw, 4vh, 40px);background-color:white;color:black;width:var(--size);border:none;border-radius:2px;font-size:calc(var(--size) * 0.5);margin:0}.keyboard.svelte-wk2j3k button.exact.svelte-wk2j3k{background:var(--color-theme-2);color:white}.keyboard.svelte-wk2j3k button.missing.svelte-wk2j3k{opacity:0.5}.keyboard.svelte-wk2j3k button.close.svelte-wk2j3k{border:2px solid var(--color-theme-2)}.keyboard.svelte-wk2j3k button.svelte-wk2j3k:focus{background:var(--color-theme-1);color:white;outline:none}.keyboard.svelte-wk2j3k button[data-key='enter'].svelte-wk2j3k,.keyboard.svelte-wk2j3k button[data-key='backspace'].svelte-wk2j3k{position:absolute;bottom:0;width:calc(1.5 * var(--size));height:calc(1 / 3 * (100% - 2 * var(--gap)));text-transform:uppercase;font-size:calc(0.3 * var(--size));padding-top:calc(0.15 * var(--size))}.keyboard.svelte-wk2j3k button[data-key='enter'].svelte-wk2j3k{right:calc(50% + 3.5 * var(--size) + 0.8rem)}.keyboard.svelte-wk2j3k button[data-key='backspace'].svelte-wk2j3k{left:calc(50% + 3.5 * var(--size) + 0.8rem)}.keyboard.svelte-wk2j3k button[data-key='enter'].svelte-wk2j3k:disabled{opacity:0.5}.restart.svelte-wk2j3k.svelte-wk2j3k{width:100%;padding:1rem;background:rgba(255, 255, 255, 0.5);border-radius:2px;border:none}.restart.svelte-wk2j3k.svelte-wk2j3k:focus,.restart.svelte-wk2j3k.svelte-wk2j3k:hover{background:var(--color-theme-1);color:white;outline:none}@keyframes svelte-wk2j3k-wiggle{0%{transform:translateX(0)}10%{transform:translateX(-2px)}30%{transform:translateX(4px)}50%{transform:translateX(-6px)}70%{transform:translateX(+4px)}90%{transform:translateX(-2px)}100%{transform:translateX(0)}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let won;
  let i;
  let submittable;
  let { data } = $$props;
  let { form } = $$props;
  let classnames;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  $$result.css.add(css);
  won = data.answers.at(-1) === "xxxxx";
  i = won ? -1 : data.answers.length;
  {
    {
      classnames = {};
      data.answers.forEach((answer, i2) => {
        const guess = data.guesses[i2];
        for (let i3 = 0; i3 < 5; i3 += 1) {
          const letter = guess[i3];
          if (answer[i3] === "x") {
            classnames[letter] = "exact";
          } else if (!classnames[letter]) {
            classnames[letter] = answer[i3] === "c" ? "close" : "missing";
          }
        }
      });
    }
  }
  submittable = ((_a = data.guesses[i]) == null ? void 0 : _a.length) === 5;
  return `

${$$result.head += `<!-- HEAD_svelte-18lvto8_START -->${$$result.title = `<title>Sverdle</title>`, ""}<meta name="${"description"}" content="${"A Wordle clone written in SvelteKit"}"><!-- HEAD_svelte-18lvto8_END -->`, ""}

<form method="${"POST"}" action="${"?/enter"}" class="${"svelte-wk2j3k"}"><a class="${"how-to-play svelte-wk2j3k"}" href="${"/sverdle/how-to-play"}">How to play</a>

	<div class="${[
    "grid svelte-wk2j3k",
    (!won ? "playing" : "") + " " + ((form == null ? void 0 : form.badGuess) ? "bad-guess" : "")
  ].join(" ").trim()}">${each(Array(6), (_, row) => {
    let current = row === i;
    return `

			<div class="${["row svelte-wk2j3k", current ? "current" : ""].join(" ").trim()}">${each(Array(5), (_2, column) => {
      var _a2, _b;
      let answer = (_a2 = data.answers[row]) == null ? void 0 : _a2[column];
      return `

					<input name="${"guess"}" ${!current ? "disabled" : ""} readonly${add_attribute("aria-selected", current && column === data.guesses[row].length, 0)}${add_attribute("value", ((_b = data.guesses[row]) == null ? void 0 : _b[column]) ?? "", 0)} class="${[
        "svelte-wk2j3k",
        (answer === "x" ? "exact" : "") + " " + (answer === "c" ? "close" : "")
      ].join(" ").trim()}">`;
    })}
			</div>`;
  })}</div>

	<div class="${"controls svelte-wk2j3k"}">${won || data.answers.length >= 6 ? `${!won && data.answer ? `<p>the answer was &quot;${escape(data.answer)}&quot;</p>` : ``}
			<button data-key="${"enter"}" aria-selected="${"true"}" class="${"restart svelte-wk2j3k"}" formaction="${"?/restart"}">${escape(won ? "you won :)" : `game over :(`)} play again?
			</button>` : `<div class="${"keyboard svelte-wk2j3k"}"><button data-key="${"enter"}"${add_attribute("aria-selected", submittable, 0)} ${!submittable ? "disabled" : ""} class="${"svelte-wk2j3k"}">enter</button>

				<button data-key="${"backspace"}" formaction="${"?/update"}" name="${"key"}" value="${"backspace"}" class="${"svelte-wk2j3k"}">back
				</button>

				${each(["qwertyuiop", "asdfghjkl", "zxcvbnm"], (row) => {
    return `<div class="${"row svelte-wk2j3k"}">${each(row, (letter) => {
      return `<button${add_attribute("data-key", letter, 0)} class="${escape(null_to_empty(classnames[letter]), true) + " svelte-wk2j3k"}" ${data.guesses[i].length === 5 ? "disabled" : ""} formaction="${"?/update"}" name="${"key"}"${add_attribute("value", letter, 0)}>${escape(letter)}
							</button>`;
    })}
					</div>`;
  })}</div>`}</div></form>

${won ? `<div style="${"position: absolute; left: 50%; top: 30%"}"></div>` : ``}`;
});
export {
  Page as default
};
