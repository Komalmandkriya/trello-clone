/**
 * @openapi
 * /api/boards:
 *   post:
 *     summary: Create a new board
 *     description: Creates a new board inside a workspace.
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceId
 *               - name
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 example: 6875dfd9583d7d3d8c4f5c1b
 *               name:
 *                 type: string
 *                 example: Frontend Board
 *               description:
 *                 type: string
 *                 example: Board for frontend tasks
 *     responses:
 *       201:
 *         description: Board created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not a workspace member
 */
/**
 * @openapi
 * /api/boards/workspace/{workspaceId}:
 *   get:
 *     summary: Get all boards of a workspace
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6875dfd9583d7d3d8c4f5c1b
 *     responses:
 *       200:
 *         description: Boards fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Workspace not found
 */

/**
 * @openapi
 * /api/boards/{boardId}:
 *   get:
 *     summary: Get board by ID
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6876bde8b7c34c17ec8d45f9
 *     responses:
 *       200:
 *         description: Board fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */

/**
 * @openapi
 * /api/boards/{boardId}:
 *   patch:
 *     summary: Update board
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6876bde8b7c34c17ec8d45f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Frontend Board
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Board updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */

/**
 * @openapi
 * /api/boards/{boardId}:
 *   patch:
 *     summary: Update board
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6876bde8b7c34c17ec8d45f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Frontend Board
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Board updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */

/**
 * @openapi
 * /api/boards/{boardId}/archive:
 *   patch:
 *     summary: Archive a board
 *     description: Archives the specified board.
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6876bde8b7c34c17ec8d45f9
 *     responses:
 *       200:
 *         description: Board archived successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */

/**
 * @openapi
 * /api/boards/{boardId}:
 *   delete:
 *     summary: Delete a board
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6876bde8b7c34c17ec8d45f9
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */

/**
 * @openapi
 * /api/boards/{boardId}/background:
 *   post:
 *     summary: Upload board background
 *     description: Uploads or replaces the board background image.
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6876bde8b7c34c17ec8d45f9
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - background
 *             properties:
 *               background:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Background uploaded successfully
 *       400:
 *         description: Invalid image
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Board not found
 */
