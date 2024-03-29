import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema:({image})=> z.object({
		title: z.string(),
		description: z.string().optional(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date().optional(),
		heroImage: image().optional(),
    draft: z.boolean().optional(),
	}),
});

export const collections = { blog };
