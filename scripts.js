(() => {
  const countNodes = [...document.querySelectorAll("[data-pr-count]")];

  const updateCount = async (node) => {
    const queryUrl = new URL(node.href);
    const [owner, repository] = queryUrl.pathname.split("/").filter(Boolean);
    const query = `repo:${owner}/${repository} ${queryUrl.searchParams.get("q")}`;
    const apiUrl = new URL("https://api.github.com/search/issues");
    apiUrl.searchParams.set("q", query);
    apiUrl.searchParams.set("per_page", "1");
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`GitHub Search returned ${response.status}`);
    const result = await response.json();
    node.textContent = Number(result.total_count).toLocaleString("en-US");
  };

  countNodes.forEach((node) => {
    updateCount(node).catch(() => {
      node.textContent = "unavailable";
      node.classList.add("count-error");
    });
  });
})();
