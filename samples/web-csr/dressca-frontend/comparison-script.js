import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const URLS = {
  vue: 'http://localhost:5173/',
  react: 'http://localhost:5174/'
};

const OUTPUT_DIR = '/Users/yuheisuzuki/Private/maia/samples/web-csr/dressca-frontend/comparison-results';

// Helper function to extract detailed element info
async function extractElementDetails(page, selector, name) {
  try {
    const element = await page.$(selector);
    if (!element) {
      return { error: `Element not found: ${selector}` };
    }

    const details = await element.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return {
        tag: el.tagName,
        classes: Array.from(el.classList),
        dimensions: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        },
        styles: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          padding: styles.padding,
          paddingTop: styles.paddingTop,
          paddingRight: styles.paddingRight,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          margin: styles.margin,
          marginTop: styles.marginTop,
          marginRight: styles.marginRight,
          marginBottom: styles.marginBottom,
          marginLeft: styles.marginLeft,
          border: styles.border,
          borderRadius: styles.borderRadius,
          display: styles.display,
          flexDirection: styles.flexDirection,
          justifyContent: styles.justifyContent,
          alignItems: styles.alignItems,
          gap: styles.gap,
          gridTemplateColumns: styles.gridTemplateColumns,
          gridGap: styles.gridGap,
          position: styles.position,
          zIndex: styles.zIndex,
          lineHeight: styles.lineHeight,
          textAlign: styles.textAlign,
          letterSpacing: styles.letterSpacing,
          textTransform: styles.textTransform,
          boxShadow: styles.boxShadow,
          overflow: styles.overflow
        },
        textContent: el.textContent?.trim().substring(0, 200),
        innerHTML: el.innerHTML.substring(0, 500),
        attributes: Array.from(el.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {})
      };
    });

    return details;
  } catch (error) {
    return { error: error.message };
  }
}

// Extract carousel details
async function extractCarouselDetails(page) {
  console.log('  - Extracting carousel details...');

  // Try multiple possible carousel selectors
  const carouselSelectors = [
    '[class*="carousel"]',
    '[class*="hero"]',
    '[class*="slider"]',
    '[class*="banner"]',
    'section:first-of-type',
    'main > div:first-child',
    '[data-testid*="carousel"]',
    '[data-testid*="hero"]'
  ];

  let carouselElement = null;
  let usedSelector = null;

  for (const selector of carouselSelectors) {
    try {
      carouselElement = await page.$(selector);
      if (carouselElement) {
        usedSelector = selector;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!carouselElement) {
    return { error: 'Carousel element not found' };
  }

  const carouselDetails = await carouselElement.evaluate((el, selector) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // Find navigation buttons
    const navButtons = el.querySelectorAll('button[class*="nav"], button[class*="arrow"], [class*="prev"], [class*="next"]');
    const dotIndicators = el.querySelectorAll('[class*="dot"], [class*="indicator"], [class*="pagination"]');

    return {
      selector: selector,
      tag: el.tagName,
      classes: Array.from(el.classList),
      dimensions: {
        width: rect.width,
        height: rect.height
      },
      styles: {
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        margin: styles.margin,
        position: styles.position,
        display: styles.display,
        overflow: styles.overflow
      },
      navigation: {
        hasButtons: navButtons.length > 0,
        buttonCount: navButtons.length,
        buttonClasses: Array.from(navButtons).map(btn => Array.from(btn.classList))
      },
      indicators: {
        hasDots: dotIndicators.length > 0,
        dotCount: dotIndicators.length,
        dotClasses: Array.from(dotIndicators).map(dot => Array.from(dot.classList))
      },
      textContent: el.textContent?.trim(),
      innerHTML: el.innerHTML.substring(0, 1000),
      childCount: el.children.length
    };
  }, usedSelector);

  return carouselDetails;
}

// Extract product grid details
async function extractProductGridDetails(page) {
  console.log('  - Extracting product grid details...');

  const gridSelectors = [
    '[class*="product-grid"]',
    '[class*="products"]',
    '[class*="grid"]',
    '[data-testid*="product"]',
    'main section:nth-of-type(2)',
    'main > div:nth-child(2)'
  ];

  let gridElement = null;
  for (const selector of gridSelectors) {
    try {
      gridElement = await page.$(selector);
      if (gridElement) break;
    } catch (e) {
      continue;
    }
  }

  if (!gridElement) {
    return { error: 'Product grid not found' };
  }

  return await gridElement.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const productCards = el.querySelectorAll('[class*="product"], [class*="card"], [class*="item"]');

    return {
      tag: el.tagName,
      classes: Array.from(el.classList),
      dimensions: {
        width: rect.width,
        height: rect.height
      },
      styles: {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
        gridGap: styles.gridGap,
        columnGap: styles.columnGap,
        rowGap: styles.rowGap,
        padding: styles.padding
      },
      productCount: productCards.length,
      innerHTML: el.innerHTML.substring(0, 1000)
    };
  });
}

// Extract filter section details
async function extractFilterDetails(page) {
  console.log('  - Extracting filter section details...');

  const filterSelectors = [
    '[class*="filter"]',
    '[class*="sidebar"]',
    'aside',
    '[data-testid*="filter"]'
  ];

  let filterElement = null;
  for (const selector of filterSelectors) {
    try {
      filterElement = await page.$(selector);
      if (filterElement) break;
    } catch (e) {
      continue;
    }
  }

  if (!filterElement) {
    return { error: 'Filter section not found' };
  }

  return await filterElement.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return {
      tag: el.tagName,
      classes: Array.from(el.classList),
      dimensions: {
        width: rect.width,
        height: rect.height
      },
      styles: {
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        margin: styles.margin,
        position: styles.position,
        display: styles.display
      },
      innerHTML: el.innerHTML.substring(0, 2000)
    };
  });
}

// Extract button styles
async function extractButtonStyles(page) {
  console.log('  - Extracting button styles...');

  const buttons = await page.$$('button, a[class*="button"], a[class*="btn"]');

  const buttonStyles = [];
  for (let i = 0; i < Math.min(buttons.length, 10); i++) {
    const btnDetails = await buttons[i].evaluate((btn) => {
      const styles = window.getComputedStyle(btn);
      const rect = btn.getBoundingClientRect();

      return {
        tag: btn.tagName,
        classes: Array.from(btn.classList),
        text: btn.textContent?.trim(),
        dimensions: {
          width: rect.width,
          height: rect.height
        },
        styles: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          textTransform: styles.textTransform,
          boxShadow: styles.boxShadow
        }
      };
    });
    buttonStyles.push(btnDetails);
  }

  return buttonStyles;
}

// Extract header details
async function extractHeaderDetails(page) {
  console.log('  - Extracting header details...');

  const headerSelectors = ['header', '[role="banner"]', 'nav'];

  let headerElement = null;
  for (const selector of headerSelectors) {
    try {
      headerElement = await page.$(selector);
      if (headerElement) break;
    } catch (e) {
      continue;
    }
  }

  if (!headerElement) {
    return { error: 'Header not found' };
  }

  return await headerElement.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return {
      tag: el.tagName,
      classes: Array.from(el.classList),
      dimensions: {
        width: rect.width,
        height: rect.height
      },
      styles: {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        position: styles.position,
        zIndex: styles.zIndex,
        boxShadow: styles.boxShadow
      },
      innerHTML: el.innerHTML.substring(0, 1000)
    };
  });
}

// Extract footer details
async function extractFooterDetails(page) {
  console.log('  - Extracting footer details...');

  const footerElement = await page.$('footer, [role="contentinfo"]');

  if (!footerElement) {
    return { error: 'Footer not found' };
  }

  return await footerElement.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return {
      tag: el.tagName,
      classes: Array.from(el.classList),
      dimensions: {
        width: rect.width,
        height: rect.height
      },
      styles: {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        marginTop: styles.marginTop
      },
      innerHTML: el.innerHTML.substring(0, 1000)
    };
  });
}

// Extract font details
async function extractFontDetails(page) {
  console.log('  - Extracting font details...');

  const fontElements = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const body = document.body;
    const buttons = Array.from(document.querySelectorAll('button, a[class*="button"]'));

    const getStyles = (el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        textTransform: styles.textTransform
      };
    };

    return {
      headings: headings.slice(0, 10).map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim().substring(0, 100),
        styles: getStyles(h)
      })),
      body: getStyles(body),
      buttons: buttons.slice(0, 5).map(btn => ({
        text: btn.textContent?.trim(),
        styles: getStyles(btn)
      }))
    };
  });

  return fontElements;
}

// Take section screenshots
async function takeSectionScreenshots(page, version) {
  console.log(`  - Taking section screenshots for ${version}...`);

  const sections = [
    { name: 'carousel', selectors: ['[class*="carousel"]', '[class*="hero"]', 'section:first-of-type'] },
    { name: 'filter', selectors: ['[class*="filter"]', 'aside', '[class*="sidebar"]'] },
    { name: 'product-card', selectors: ['[class*="product"]:first-of-type', '[class*="card"]:first-of-type'] },
    { name: 'header', selectors: ['header', 'nav'] },
    { name: 'footer', selectors: ['footer', '[role="contentinfo"]'] }
  ];

  for (const section of sections) {
    for (const selector of section.selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.screenshot({
            path: path.join(OUTPUT_DIR, `${version}-${section.name}.png`)
          });
          console.log(`    ✓ ${section.name} screenshot captured`);
          break;
        }
      } catch (error) {
        continue;
      }
    }
  }
}

// Main analysis function for each version
async function analyzeVersion(page, url, version) {
  console.log(`\nAnalyzing ${version.toUpperCase()} version (${url})...`);

  // Navigate to the page
  console.log('  - Navigating to page...');
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for images to load
  console.log('  - Waiting for images to load...');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take full page screenshot
  console.log('  - Taking full page screenshot...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${version}-fullpage.png`),
    fullPage: true
  });

  // Extract all details
  const details = {
    version,
    url,
    timestamp: new Date().toISOString(),
    carousel: await extractCarouselDetails(page),
    productGrid: await extractProductGridDetails(page),
    filters: await extractFilterDetails(page),
    buttons: await extractButtonStyles(page),
    header: await extractHeaderDetails(page),
    footer: await extractFooterDetails(page),
    fonts: await extractFontDetails(page)
  };

  // Take section screenshots
  await takeSectionScreenshots(page, version);

  // Get full DOM structure
  console.log('  - Extracting DOM structure...');
  const domStructure = await page.evaluate(() => {
    const getStructure = (el, depth = 0) => {
      if (depth > 5) return null; // Limit depth

      return {
        tag: el.tagName,
        classes: Array.from(el.classList),
        id: el.id,
        children: Array.from(el.children).slice(0, 20).map(child => getStructure(child, depth + 1)).filter(Boolean)
      };
    };

    return getStructure(document.body);
  });

  details.domStructure = domStructure;

  // Save individual results
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${version}-details.json`),
    JSON.stringify(details, null, 2)
  );

  console.log(`✓ ${version.toUpperCase()} analysis complete`);

  return details;
}

// Compare two versions and generate diff report
function generateComparisonReport(vueDetails, reactDetails) {
  console.log('\nGenerating comparison report...');

  const differences = {
    timestamp: new Date().toISOString(),
    summary: {
      totalDifferences: 0,
      majorDifferences: [],
      minorDifferences: []
    },
    carousel: {},
    productGrid: {},
    filters: {},
    buttons: {},
    header: {},
    footer: {},
    fonts: {},
    domStructure: {}
  };

  // Helper function to compare objects
  const compareObjects = (vue, react, path = '') => {
    const diffs = [];

    if (typeof vue !== typeof react) {
      diffs.push({
        path,
        type: 'type_mismatch',
        vue: typeof vue,
        react: typeof react
      });
      return diffs;
    }

    if (typeof vue === 'object' && vue !== null && react !== null) {
      const allKeys = new Set([...Object.keys(vue || {}), ...Object.keys(react || {})]);

      for (const key of allKeys) {
        const newPath = path ? `${path}.${key}` : key;

        if (!(key in vue)) {
          diffs.push({
            path: newPath,
            type: 'missing_in_vue',
            react: react[key]
          });
        } else if (!(key in react)) {
          diffs.push({
            path: newPath,
            type: 'missing_in_react',
            vue: vue[key]
          });
        } else if (JSON.stringify(vue[key]) !== JSON.stringify(react[key])) {
          if (typeof vue[key] === 'object') {
            diffs.push(...compareObjects(vue[key], react[key], newPath));
          } else {
            diffs.push({
              path: newPath,
              type: 'value_difference',
              vue: vue[key],
              react: react[key]
            });
          }
        }
      }
    } else if (vue !== react) {
      diffs.push({
        path,
        type: 'value_difference',
        vue,
        react
      });
    }

    return diffs;
  };

  // Compare each section
  const sections = ['carousel', 'productGrid', 'filters', 'buttons', 'header', 'footer', 'fonts'];

  for (const section of sections) {
    differences[section] = compareObjects(vueDetails[section], reactDetails[section], section);
    differences.summary.totalDifferences += differences[section].length;
  }

  // Categorize differences
  for (const section of sections) {
    for (const diff of differences[section]) {
      const diffInfo = {
        section,
        ...diff
      };

      // Major differences
      if (diff.type === 'missing_in_vue' || diff.type === 'missing_in_react' ||
          diff.path.includes('dimensions') || diff.path.includes('classes')) {
        differences.summary.majorDifferences.push(diffInfo);
      } else {
        differences.summary.minorDifferences.push(diffInfo);
      }
    }
  }

  return differences;
}

// Main execution
async function main() {
  console.log('=== Starting Detailed Vue vs React Comparison ===\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Analyze both versions
    const vueDetails = await analyzeVersion(page, URLS.vue, 'vue');
    const reactDetails = await analyzeVersion(page, URLS.react, 'react');

    // Generate comparison report
    const comparisonReport = generateComparisonReport(vueDetails, reactDetails);

    // Save comparison report
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'comparison-report.json'),
      JSON.stringify(comparisonReport, null, 2)
    );

    // Generate human-readable summary
    const summary = `
=== COMPARISON SUMMARY ===

Total Differences Found: ${comparisonReport.summary.totalDifferences}

Major Differences (${comparisonReport.summary.majorDifferences.length}):
${comparisonReport.summary.majorDifferences.slice(0, 20).map(d =>
  `  - ${d.section}.${d.path}: ${d.type}`
).join('\n')}

Minor Differences (${comparisonReport.summary.minorDifferences.length}):
${comparisonReport.summary.minorDifferences.slice(0, 20).map(d =>
  `  - ${d.section}.${d.path}: ${d.type}`
).join('\n')}

Screenshots saved to: ${OUTPUT_DIR}
Full details saved to: ${OUTPUT_DIR}/comparison-report.json
`;

    console.log(summary);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'summary.txt'),
      summary
    );

    console.log('\n✓ Comparison complete!');
    console.log(`\nResults saved to: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('Error during comparison:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
