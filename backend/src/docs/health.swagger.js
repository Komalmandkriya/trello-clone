/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Returns the current status of the server.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 */
