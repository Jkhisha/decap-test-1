module.exports = function (eleventyConfig) {
  // Copy these folders straight to the output untouched.
  // NOTE: this is why your animation JS/CSS would survive intact —
  // Eleventy never rewrites passthrough files, it just copies them.
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/uploads");

  // Tiny YYYY-MM-DD date filter so templates can print post dates.
  eleventyConfig.addFilter("date", function (value) {
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d) ? "" : d.toISOString().slice(0, 10);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
