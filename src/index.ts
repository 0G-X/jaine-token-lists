import { schema, type TokenList } from "@uniswap/token-lists";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";

// Load your token list
const tokenListPath = process.argv[2] || "./src/tokens/mainnet.tokenlist.json";
const tokenListData = fs.readFileSync(tokenListPath, "utf8");
const tokenList: TokenList = JSON.parse(tokenListData);

// Validate
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);
const validator = ajv.compile(schema);
const valid = validator(tokenList);

if (valid) {
	console.log("✅ Token list is valid!");
	console.log(`Name: ${tokenList.name}`);
	console.log(
		`Version: ${tokenList.version.major}.${tokenList.version.minor}.${tokenList.version.patch}`,
	);
	console.log(`Tokens: ${tokenList.tokens.length}`);
} else {
	console.log("❌ Token list validation failed:");
	validator.errors?.forEach((error) => {
		console.log(`- ${error.instancePath}: ${error.message}`);
	});
}
