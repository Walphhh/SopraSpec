import { systemTree, TreeNode } from "@/lib/systemTree"
import Image from "next/image"
import Link from "next/link"
import OptionCard from "@/components/OptionCard"

export default async function SystemTreePage({ params }: { params: Promise<{ path?: string[] }> }) {
    const { path = [] } = await params

    // Traverse systemTree based on path
    let node: any = systemTree
    for (const segment of path) {
        node = node?.[segment] || node?.options?.[segment]
    }

    // Handle invalid path
    if (!node) {
        return <div className="p-8">Invalid system path</div>
    }

    // The distributor is always the first path segment
    const distributorKey = path[0]
    const distributor = systemTree[distributorKey]

    const optionCount = Object.keys(node.options ?? {}).length // the number of options

    return (
        <div className="p-6">
            {/* Distributor logo */}
            {distributor && (
                <div className="flex justify-center">
                    {distributor.image && (
                        <Image
                            src={distributor.image}
                            alt={distributor.label}
                            width={250}
                            height={30}
                            className="object-contain"
                        />
                    )}
                </div>
            )}

            {/* Instruction tagline */}
            <h4 className="mb-4">
                {node.description || "Choose the system, select the products, and generate Product Specifications"}
            </h4>

            {/* If node has children → render clickable cards */}
            {node.options ? (
                <div
                    className={
                        optionCount === 4
                            ? "inline-grid grid-cols-2 gap-x-[150px] gap-y-[30px] justify-center [grid-columns:500px] max-[1150px]:grid-cols-1"
                            : "flex flex-wrap justify-center gap-x-[150px] gap-y-[30px]"
                    }
                    style={{ justifyContent: "center" }}
                >
                    {Object.entries(node.options).map(([key, opt]) => {
                        const option = opt as TreeNode
                        const href = `/systems/${[...path, key].join("/")}`
                        return (
                            <OptionCard
                                key={key}
                                href={href}
                                title={option.label}
                                image={option.image}
                                fit={option.fit}
                                optionCount={optionCount}
                                textOnly={!option.image}
                            />
                        )
                    })}
                </div>
            ) : (
                // Leaf node
                <div>
                    <p className="text-[#7C878E] flex justify-center">Systems Listed Here</p>
                </div>
            )}
        </div>
    )
}
