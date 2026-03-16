// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/area",
        "http://localhost:3000/dispose",
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "aria-allowed-attr": ["error", { minScore: 1 }],
        "aria-required-attr": ["error", { minScore: 1 }],
        "aria-roles": ["error", { minScore: 1 }],
        "aria-valid-attr": ["error", { minScore: 1 }],
        "aria-valid-attr-value": ["error", { minScore: 1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
