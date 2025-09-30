export type TreeNode = {
    label: string
    image?: string
    description?: string
    fit?: "cover" | "contain"
    options?: Record<string, TreeNode>
}

// ---------- Helpers (factories) ----------
function makeSubstrate(name: string, image: string, description: string, fit: "cover" | "contain"): TreeNode {
    return {
        label: name,
        image,
        description,
        fit,
        options: {
            bitumen: makeMembrane("Bitumen", "/roof-membranes/roof-bitumen.png", "Select whether the Roof System is Insulated or Not", "contain"),
            synthetic: makeMembrane("Synthetic", "/roof-membranes/roof-synthetic.png", "Select whether the Roof System is Insulated or Not", "contain"),
        },
    }
}

function makeMembrane(name: string, image: string, description: string, fit: "cover" | "contain"): TreeNode {
    return {
        label: name,
        image,
        description,
        fit,
        options: {
            insulated: makeProtection("Insulated", "/roof-insulated/roof-insulated.png", "Select Finish Type", "contain"),
            "not-insulated": makeProtection("Not Insulated", "/roof-insulated/roof-non-insulated.png", "Select Finish Type", "contain"),
        },
    }
}

function makeProtection(name: string, image: string, description: string, fit: "cover" | "contain"): TreeNode {
    return {
        label: name,
        image,
        description,
        fit,
        options: {
            exposed: makeFixings("Exposed", "/roof-finish-types/roof-exposed.png", "Select Installation System", "contain"),
            protected: makeFixings("Protected / Green", "/roof-finish-types/roof-protected.png", "Select Installation System", "contain"),
        },
    }
}

function makeFixings(name: string, image: string, description: string, fit: "cover" | "contain"): TreeNode {
    return {
        label: name,
        image,
        description,
        fit,
        options: {
            "self-adhered": {
                label: "Self-Adhered",
                description: "Select Roof System"
            },
            "mechanically-fixed": {
                label: "Mechanically Fixed",
                description: "Select Roof System"
            },
            "loose-laid": {
                label: "Loose Laid",
                description: "Select Roof System"
            },
        },
    }
}

// ---------- Roof Tree ----------
const roofTree: TreeNode = {
    label: "Roof",
    image: "/areas/roof.jpg",
    description: "Select Project Type",
    options: {
        "new-build": {
            label: "New Build",
            image: "/roof-project-types/new-build.avif",
            description: "Select Roof Deck Material",
            options: {
                concrete: makeSubstrate("Concrete", "/roof-materials/concrete.png", "Select Waterproofing Membrane Type", "contain"),
                timber: makeSubstrate("Timber", "/roof-materials/timber.png", "Select Waterproofing Membrane Type", "contain"),
                metal: makeSubstrate("Metal", "/roof-materials/metal.png", "Select Waterproofing Membrane Type", "contain"),
            },
        },
        refurbishment: {
            label: "Refurbishment",
            image: "/roof-project-types/refurbishment.avif",
            description: "Select Roof Deck Material",
            options: {
                concrete: makeSubstrate("Concrete", "/roof-materials/concrete.png", "Select Type of Waterproofing Membrane", "contain"),
                timber: makeSubstrate("Timber", "/roof-materials/timber.png", "Select Type of Waterproofing Membrane", "contain"),
                metal: makeSubstrate("Metal", "/roof-materials/metal.png", "Select Type of Waterproofing Membrane", "contain"),
            },
        },
    },
}

// ---------- Wall Tree ----------
const wallTree: TreeNode = {
    label: "Wall",
    image: "/areas/wall.png",
    description: "Select Waterproofing Membrane Type",
    options: {
        membranes: {
            label: "Wall Membranes",
            image: "/wall/wall-membrane.png",
            description: "Select Vapour Control Layer",
            fit: "contain",
            options: {
                vapour: {
                    label: "Vapour",
                    image: "/wall/wall-vapour-membrane.png",
                    description: "Select Wall System",
                    fit: "contain"
                },
            },
        },
    },
}

// ---------- Foundation Tree ----------
const foundationTree: TreeNode = {
    label: "Foundation",
    image: "/areas/foundation.png",
    description: "Select Foundation Installation Type",
    options: {
        "pre-applied": {
            label: "Pre-Applied",
            image: "/foundation/foundation-pre-applied.png",
            description: "Select Waterproofing Membrane Type",
            fit: "contain",
            options: {
                bitumen: {
                    label: "Bitumen",
                    image: "/foundation/foundation-pre-applied-bitumen.png",
                    description: "Select Foundation System",
                    fit: "contain"
                },
                synthetic: {
                    label: "Synthetic",
                    image: "/foundation/foundation-synthetic.png",
                    description: "Select Foundation System",
                    fit: "contain"
                },
            },
        },
        "post-applied": {
            label: "Post-Applied",
            image: "/foundation/foundation-post-applied.png",
            fit: "contain",
            description: "Select Waterproofing Membrane Type",
            options: {
                bitumen: {
                    label: "Bitumen",
                    image: "/foundation/foundation-post-applied-bitumen.png",
                    description: "Select Foundation System",
                    fit: "contain"
                },
                synthetic: {
                    label: "Synthetic",
                    image: "/foundation/foundation-synthetic.png",
                    description: "Select Foundation System",
                    fit: "contain"
                },
            },
        },
    },
}

// ---------- Civil Works Tree ----------
const civilWorksTree: TreeNode = {
    label: "Civil Works",
    image: "/areas/civil.png",
    description: "Select Civil Work",
    options: {
        tunnels: {
            label: "Tunnels",
            image: "/civil/tunnel.png",
            description: "Select Waterproofing Membrane Type",
            options: {
                bitumen: {
                    label: "Bitumen",
                    image: "/civil/tunnel-bitumen.png",
                    description: "Select Tunnel System",
                    fit: "contain"
                },
                synthetic: {
                    label: "Synthetic",
                    image: "/civil/tunnel-synthetic.png",
                    description: "Select Tunnel System",
                    fit: "contain"
                },
            },
        },
        "bridges-and-roads": {
            label: "Bridges & Roads",
            image: "/civil/bridge-road.jpg",
            description: "Select Waterproofing Membrane Type",
            options: {
                bitumen: {
                    label: "Bitumen",
                    image: "/civil/bridge-road-bitumen.png",
                    description: "Select Bridge / Road System",
                    fit: "contain"
                },
            },
        },
        "hydraulic-work": {
            label: "Hydraulic Works",
            image: "/civil/hydraulic.png",
            description: "Select Waterproofing Membrane Type",
            options: {
                bitumen: {
                    label: "Bitumen",
                    image: "/civil/hydraulic-bitumen.png",
                    description: "Select Hydralic Work System",
                    fit: "contain"
                },
                synthetic: {
                    label: "Synthetic",
                    image: "/civil/hydraulic-synthetic.png",
                    description: "Select Hydralic Work System",
                    fit: "contain"
                },
            },
        },
    },
}

// ---------- Internal Wet Areas Tree ----------
const internalWetTree: TreeNode = {
    label: "Internal Wet Areas",
    image: "/areas/internal.png",
    description: "Select a system",
    options: {
        bathroom: {
            label: "Bathroom",
            image: "/internal/bathroom.png",
            description: "Select Bathroom System"
        },
        "rooftop-terrace": {
            label: "Rooftop Terrace",
            image: "/internal/rooftop.png",
            description: "Select Rooftop Terrace System"
        },
    },
}

// ---------- Base systemTree ----------
export const systemTree: Record<string, TreeNode> = {
    bayset: {
        label: "Bayset",
        image: "/logos/logo-bayset.webp",
        description: "Choose an application area",
        options: {
            roof: roofTree,
            wall: wallTree,
            foundation: foundationTree,
            "civil-works": civilWorksTree,
        },
    },
    enduroflex: {
        label: "Enduroflex",
        image: "/logos/logo-enduroflex-black.png",
        description: "Choose an application area",
        options: {
            roof: roofTree,
            wall: wallTree,
            foundation: foundationTree,
            "civil-works": civilWorksTree,
            "internal-wet-areas": internalWetTree,
        },
    },
    allduro: {
        label: "Allduro",
        image: "/logos/logo-allduro.png",
        description: "Choose an application area",
        options: {
            roof: roofTree,
            wall: wallTree,
            foundation: foundationTree,
            "civil-works": civilWorksTree,
            "internal-wet-areas": internalWetTree,
        },
    },
}
