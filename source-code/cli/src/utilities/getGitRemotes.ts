import { raw } from "@inlang-git/client/raw"
import fs from "node:fs"
import type { NodeishFilesystem } from "@inlang-git/fs"

// TODO: move to lix api when local repos supported
/**
 * Gets the git origin url of the current repository.
 *
 * @params args.filepath filepath override for injecting non cwd path for testing
 * @params args.nodeishFs fs implementation override for injecting virtual fs for testing
 * @returns The git origin url or undefined if it could not be found.
 */
export async function getGitRemotes(
	args: { filepath?: string; nodeishFs?: NodeishFilesystem } = {},
) {
	try {
		const usedFs = args.nodeishFs || fs
		const root = await raw.findRoot({ fs: usedFs, filepath: args.filepath || process.cwd() })

		const remotes = await raw.listRemotes({
			fs: usedFs,
			dir: root,
		})
		return remotes
	} catch (e) {
		return undefined
	}
}
