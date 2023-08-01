import { waitForElementToExist } from "../contentIndex";

interface Diff {
  file: string;
  node: ChildNode;
}

export function updateDiffs() {
  //   let diffSection = document.querySelector('[aria-label="diffs"]');
  waitForElementToExist('[aria-label="Diffs"]').then((el) => {
    // console.log(el);

    if (el instanceof HTMLElement) {
      // el.childNodes.forEach((node) => {
      // }

      let test: Diff[] = [];
      el.childNodes.forEach((node) => {
        // console.log(node?.firstChild?.firstChild?.getAttribute("id"));

        if (node?.firstChild?.firstChild?.getAttribute("id")) {
          test.push({
            file: node?.firstChild?.firstChild?.getAttribute("id"),
            node: node,
          });
        }
      });

      console.log(test);

      setTimeout(() => {
        test.forEach((diff) => {
          let file = diff.file;
          let node = diff.node;

          let hide = false;
          let color = "gray";
          if (file.endsWith(".js")) {
            color = "yellow";
          } else if (file.endsWith(".cls")) {
            color = "blue";
          } else if (file.endsWith(".cmp")) {
            color = "orange";
          } else if (file.endsWith(".xml")) {
            color = "green";
            hide = true;
          } else if (file.endsWith(".css")) {
            color = "pink";
          } else if (file.endsWith(".html")) {
            color = "orange";
          }

          // change background color
          node.lastChild.lastChild.lastChild.firstChild.style.backgroundColor =
            color;

          if (hide) {
            node.lastChild.lastChild.lastChild.firstChild.style.display =
              "none";
          }

          console.log(node.firstChild);
          console.log(node.firstChild.firstChild);
          console.log(node.firstChild.lastChild);
          // console.log(node.firstChild.lastChild.firstChild);
          // console.log(node.firstChild.lastChild.firstChild);
        });
      }, 5000);

      //   let a = el.childNodes.values()
    }
  });
}
