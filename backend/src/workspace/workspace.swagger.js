/**
 * @openapi
 * components:
 *   schemas:
 *     CreateWorkspaceRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Tech Team
 *         description:
 *           type: string
 *           example: Company workspace
 *     UpdateWorkspaceRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Tech Team
 *         description:
 *           type: string
 *           example: Company workspace
 *         visibility:
 *           type: string
 *           enum: [private, public]
 */

/**
 * @openapi
 * /api/workspaces:
 *   post:
 *     summary: Create Workspace
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkspaceRequest'
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Access token is required
 *   get:
 *     summary: Get My Workspaces
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workspaces fetched successfully
 *       401:
 *         description: Access token is required
 */

/**
 * @openapi
 * /api/workspaces/{workspaceId}:
 *   get:
 *     summary: Get Workspace By ID
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace fetched successfully
 *       403:
 *         description: You are not a member of this workspace
 *       404:
 *         description: Workspace not found
 *   patch:
 *     summary: Update Workspace
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorkspaceRequest'
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: You are not a member of this workspace
 *       404:
 *         description: Workspace not found
 *   delete:
 *     summary: Delete Workspace
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *       403:
 *         description: Only the workspace owner can perform this action
 *       404:
 *         description: Workspace not found
 */

/**
 * @openapi
 * /api/workspaces/{workspaceId}/logo:
 *   post:
 *     summary: Upload Workspace Logo
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - logo
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Workspace logo uploaded successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: You are not a member of this workspace
 *       404:
 *         description: Workspace not found
 */
