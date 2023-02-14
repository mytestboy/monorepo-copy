import { test, vi } from "vitest";
import type { Config, EnvironmentFunctions } from '../config/schema.js';
import { lint } from './linter.js';
import { createRuleCollection } from './ruleCollection.js';
import { additionalKeyRule } from './rules/additionalKey.js';
import { missingKeyRule } from './rules/missingKey.js';
import { createBrandingRule } from './rules/brandingRule.js';
import { printReport } from './context.js';
import { getAllLintReports } from './query.js';
import { debug } from './_utilities.js';

const standardRules = createRuleCollection({
	missingKeyRule,
	additionalKeyRule,
});

const dummyEnv: EnvironmentFunctions = {
	$fs: vi.fn() as any,
	$import: vi.fn(),
}

const dummyConfig = {
	referenceLanguage: 'en',
	languages: ['en', 'de'],
	readResources: async () => {
		return [{
			type: "Resource",
			languageTag: {
				type: "LanguageTag",
				name: "en",
			},
			body: [
				{
					type: "Message",
					id: { type: "Identifier", name: "first-message" },
					pattern: {
						type: "Pattern",
						elements: [{ type: "Text", value: "Welcome to this Redbull app." }],
					},
				}
			],
		},
		{
			type: "Resource",
			languageTag: {
				type: "LanguageTag",
				name: "de",
			},
			body: [
				{
					type: "Message",
					id: { type: "Identifier", name: "second-message" },
					pattern: {
						type: "Pattern",
						elements: [{ type: "Text", value: "Test" }],
					},
				}
			],
		}]
	},
	writeResources: async () => undefined,
	lint: {
		rules: [
			standardRules(),
			// missingKeyRule('warn'),
			// additionalKeyRule(true),
			createBrandingRule('Red Bull', ['redbull', 'RedBull', 'Redbull'])(),
		],
	}
} satisfies Config

// test("debug code", async () => {
// 	const results = await lint(dummyConfig, dummyEnv)
// 	debug(results)

// 	results?.forEach(r => {
// 		const reports = getAllLintReports(r)
// 		reports.forEach(report => {
// 			console.log(printReport(report))
// 		});
// 	})
// })
