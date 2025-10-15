"use client";

import Image from "next/image";
import { use } from "react";

import { systemTree, TreeNode } from "@/lib/systemTree";
import OptionCard from "@/components/OptionCard";
import ProjectDropdownButton from "@/components/ProjectDropDownButton";

interface SystemTreePageProps {
    params: Promise<{ distributor: string; path?: string[] }>;
}

export default function SystemTreePage({ params }: SystemTreePageProps) {
    const { distributor, path = [] } = use(params);

    // Start at distributor node
    const distributorNode: TreeNode | undefined = systemTree[distributor];
    if (!distributorNode) {
        return <div className="p-8">Invalid distributor</div>;
    }

    // Traverse the rest of the path
    let node: any = distributorNode;
    for (const segment of path) {
        node = node?.options?.[segment];
        if (!node) break;
    }

    if (!node) {
        return <div className="p-8">Invalid system path</div>;
    }

    const optionCount = Object.keys(node.options ?? {}).length;

    return (
        <div className="p-6">
            {/* Distributor logo */}
            {distributorNode.image && (
                <div className="flex justify-center mb-4">
                    <Image
                        src={distributorNode.image}
                        alt={distributorNode.label}
                        width={250}
                        height={30}
                        className="object-contain"
                    />
                </div>
            )}

            {/* Instruction tagline */}
            <h4 className="mb-4">
                {node.description || "Choose the system, select the products, and generate Product Specifications"}
            </h4>

            {/* If node has children -> render clickable cards */}
            {node.options ? (
                <div
                    className={
                        optionCount === 4
                            ? "inline-grid grid-cols-2 gap-x-[150px] gap-y-[30px] justify-center [grid-columns:500px] max-[1150px]:grid-cols-1"
                            : "flex flex-wrap justify-center gap-x-[150px] gap-y-[30px]"
                    }
                >
                    {Object.entries(node.options).map(([key, opt]) => {
                        const option = opt as TreeNode;
                        const href = `/systems/${distributor}/${[...path, key].join("/")}`;
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
                        );
                    })}
                </div>
            ) : (
                <div>
                    <p className="text-[#7C878E] flex justify-center">Systems Listed Here</p>
                    <ProjectDropdownButton projects={["Project A", "Project B", "Project C"]} />
                </div>
            )}
        </div>
    );
}