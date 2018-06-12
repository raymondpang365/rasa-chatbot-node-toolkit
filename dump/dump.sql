--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email (
    address character varying(255),
    id integer NOT NULL,
    is_verified boolean,
    verified_at timestamp without time zone
);


ALTER TABLE public.email OWNER TO postgres;

--
-- Name: email_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.email_id_seq OWNER TO postgres;

--
-- Name: email_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_id_seq OWNED BY public.email.id;


--
-- Name: kit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kit (
    id integer NOT NULL,
    testcode character varying(255),
    test_id integer,
    user_id character varying(255),
    status_id integer
);


ALTER TABLE public.kit OWNER TO postgres;

--
-- Name: kit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kit_id_seq OWNER TO postgres;

--
-- Name: kit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kit_id_seq OWNED BY public.kit.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id integer NOT NULL,
    session_id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    device_id character varying(255),
    create_time timestamp without time zone,
    login_time timestamp without time zone,
    refresh_token text
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.session_id_seq OWNER TO postgres;

--
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test (
    id integer,
    name character varying(255),
    description character varying(255)
);


ALTER TABLE public.test OWNER TO postgres;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_info (
    id integer NOT NULL,
    user_id character varying(255),
    device_id character varying(255),
    facebook_agent_id character varying(255),
    google_agent_id character varying(255),
    display_name character varying(255),
    email character varying(255),
    password character varying(255),
    avatar_url character varying(255),
    age integer,
    create_time timestamp without time zone,
    last_login_time timestamp without time zone,
    gender character varying(255),
    family_name character varying(255),
    given_name character varying(255),
    middle_name character varying(255),
    verify_email_nonce character varying(255),
    reset_password_nonce character varying(255)
);


ALTER TABLE public.user_info OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public.user_info.id;


--
-- Name: email id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email ALTER COLUMN id SET DEFAULT nextval('public.email_id_seq'::regclass);


--
-- Name: kit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kit ALTER COLUMN id SET DEFAULT nextval('public.kit_id_seq'::regclass);


--
-- Name: session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- Name: user_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: email; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email (address, id, is_verified, verified_at) FROM stdin;
\.


--
-- Data for Name: kit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kit (id, testcode, test_id, user_id, status_id) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, session_id, user_id, device_id, create_time, login_time, refresh_token) FROM stdin;
97	fbf1af2b-8ed3-4aaf-90c1-06f6d7efaeb3	U00000021	\N	2018-06-05 00:03:58.690091	2018-06-05 00:03:58.690091	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiZmJmMWFmMmItOGVkMy00YWFmLTkwYzEtMDZmNmQ3ZWZhZWIzIiwiaWF0IjoxNTI4MTI4MjM4LCJleHAiOjE1NDM2ODAyMzh9.bppbcP-mbeyc2ZO8nAiwXQazezfy2tBhxxWnV-heZ6w
103	fa54cd76-61c3-42d9-bb63-7b16a256b082	U00000026	\N	2018-06-10 03:21:15.476728	2018-06-10 03:21:15.476728	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiZmE1NGNkNzYtNjFjMy00MmQ5LWJiNjMtN2IxNmEyNTZiMDgyIiwiaWF0IjoxNTI4NTcyMDc1LCJleHAiOjE1NDQxMjQwNzV9.nbS4_89igEZ1zFmzlx5Qxnzo4ykDsPvoFq9EDl5uJ7c
104	8ec17380-c188-4bae-a687-88b755036517	U00000027	\N	2018-06-10 03:22:53.082659	2018-06-10 03:22:53.082659	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiOGVjMTczODAtYzE4OC00YmFlLWE2ODctODhiNzU1MDM2NTE3IiwiaWF0IjoxNTI4NTcyMTczLCJleHAiOjE1NDQxMjQxNzN9.Ckpd3uVtxdfP2DCtRH7HE58ESs5YMkbr8ezeb8HFtGs
106	9055bc17-c14b-43aa-aba5-72342e7931c2	U00000028	\N	2018-06-10 03:45:21.656767	2018-06-10 03:45:21.656767	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiOTA1NWJjMTctYzE0Yi00M2FhLWFiYTUtNzIzNDJlNzkzMWMyIiwiaWF0IjoxNTI4NTczNTIxLCJleHAiOjE1NDQxMjU1MjF9.Sz4QcfooJdtffIyUI-mLpQB-9Bdxvl-Xsx4kXjILa5w
107	940172d4-94c2-4bd3-bde5-882c3d8b34d2	U00000028	\N	2018-06-10 03:45:37.817613	2018-06-10 03:45:37.817613	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiOTQwMTcyZDQtOTRjMi00YmQzLWJkZTUtODgyYzNkOGIzNGQyIiwiaWF0IjoxNTI4NTczNTM3LCJleHAiOjE1NDQxMjU1Mzd9.V-iY104W3ryz_AAFJ6RN7tURHR421J3iWaR6uj6IBOI
108	53fa01c0-9032-4407-89f6-160629714bf2	U00000028	\N	2018-06-10 03:49:53.664706	2018-06-10 03:49:53.664706	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiNTNmYTAxYzAtOTAzMi00NDA3LTg5ZjYtMTYwNjI5NzE0YmYyIiwiaWF0IjoxNTI4NTczNzkzLCJleHAiOjE1NDQxMjU3OTN9.ImfLiaSvVCgDMhA4P_G1jPwAOyoivpHSdG5k5DhfiCM
109	1e7749db-663f-40e8-8939-63bd17f87c77	U00000028	\N	2018-06-10 03:51:06.877984	2018-06-10 03:51:06.877984	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiMWU3NzQ5ZGItNjYzZi00MGU4LTg5MzktNjNiZDE3Zjg3Yzc3IiwiaWF0IjoxNTI4NTczODY2LCJleHAiOjE1NDQxMjU4NjZ9.VX_0mJzutAfdC0kt18U4rxfADcsyz6S64W_wrtDhps4
110	2e948bac-9b0b-4bc7-a87b-4f4fa562a113	U00000028	\N	2018-06-10 03:51:47.32298	2018-06-10 03:51:47.32298	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiMmU5NDhiYWMtOWIwYi00YmM3LWE4N2ItNGY0ZmE1NjJhMTEzIiwiaWF0IjoxNTI4NTczOTA3LCJleHAiOjE1NDQxMjU5MDd9.XmwAJM-zd9Jy2xxa4TOs6iTijLcdw9PNuvX3y-1X564
111	ea2ae6ab-4c6f-4476-8878-b45292ef2c09	U00000028	\N	2018-06-10 03:53:17.26702	2018-06-10 03:53:17.26702	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiZWEyYWU2YWItNGM2Zi00NDc2LTg4NzgtYjQ1MjkyZWYyYzA5IiwiaWF0IjoxNTI4NTczOTk3LCJleHAiOjE1NDQxMjU5OTd9.QCerJbhhtgZHOdulaYm-jNO9r1CBrjxOMraAOAdwmx4
112	ae7e4d54-211a-4239-ab17-b47df1a4adb9	U00000028	\N	2018-06-10 03:54:45.296925	2018-06-10 03:54:45.296925	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiYWU3ZTRkNTQtMjExYS00MjM5LWFiMTctYjQ3ZGYxYTRhZGI5IiwiaWF0IjoxNTI4NTc0MDg1LCJleHAiOjE1NDQxMjYwODV9.-N0faCp9teLH-KGV0-oPtAd7aL7d9cSTTT0An_M9C-0
113	20d3bd9c-3efb-4da9-9907-1a5f9512c85b	U00000028	\N	2018-06-10 03:55:19.248324	2018-06-10 03:55:19.248324	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiMjBkM2JkOWMtM2VmYi00ZGE5LTk5MDctMWE1Zjk1MTJjODViIiwiaWF0IjoxNTI4NTc0MTE5LCJleHAiOjE1NDQxMjYxMTl9.mHqTxamFs-Zzu3Kby-SfWb3ZdLASWPE5yZiS_3PpFfQ
114	d8b376b5-7eb3-4240-a1fd-bd81e5e25820	U00000028	\N	2018-06-10 03:58:00.103379	2018-06-10 03:58:00.103379	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiZDhiMzc2YjUtN2ViMy00MjQwLWExZmQtYmQ4MWU1ZTI1ODIwIiwiaWF0IjoxNTI4NTc0MjgwLCJleHAiOjE1NDQxMjYyODB9.rlE7X3J-Tj3uFKpE1kJdQeJEKlZijN1Y1pxLWgwQJVg
116	49d152a9-6aec-4c38-8f50-cbb87513d60d	U00000029	\N	2018-06-11 12:09:15.378589	2018-06-11 12:09:15.378589	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiNDlkMTUyYTktNmFlYy00YzM4LThmNTAtY2JiODc1MTNkNjBkIiwiaWF0IjoxNTI4NjkwMTU1LCJleHAiOjE1NDQyNDIxNTV9.h0Ec7j2hmDu9WmI5FudvgVVM0Efg8CHjrkv1U_QGPKs
128	7ddd9456-a3e7-42e9-9d46-7748b72d05d1	U00000030	\N	2018-06-11 17:34:27.994525	2018-06-11 17:34:27.994525	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiN2RkZDk0NTYtYTNlNy00MmU5LTlkNDYtNzc0OGI3MmQwNWQxIiwiaWF0IjoxNTI4NzA5NjY3LCJleHAiOjE1NDQyNjE2Njd9.aQ17dMP1B63FS0Nk18IKZLk5Jx9bhayFzFM2S8tvI_g
129	8174142b-5249-47ac-88e8-63c6a964ae89	U00000029	\N	2018-06-11 17:35:15.036266	2018-06-11 17:35:15.036266	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiODE3NDE0MmItNTI0OS00N2FjLTg4ZTgtNjNjNmE5NjRhZTg5IiwiaWF0IjoxNTI4NzA5NzE1LCJleHAiOjE1NDQyNjE3MTV9.BdPub82btAe7asj_9PxBRS-nJJAlKolh3nyBGVRjjN8
\.


--
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test (id, name, description) FROM stdin;
1	baby	I am a baby
3	super	I am a super
2	bibibo	I am bibibo
\.


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_info (id, user_id, device_id, facebook_agent_id, google_agent_id, display_name, email, password, avatar_url, age, create_time, last_login_time, gender, family_name, given_name, middle_name, verify_email_nonce, reset_password_nonce) FROM stdin;
30	U00000030	\N	\N	102924828121258273422	Raymond Pang	\N	\N	https://lh3.googleusercontent.com/-B5sevX-ii3E/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq1EIJYsmLEsCBokoP3Q5G1piQ6Zjg/mo/photo.jpg?sz=50	\N	2018-06-11 17:34:27.991046	2018-06-11 17:50:41.286163	male	\N	Raymond	\N	\N	\N
29	U00000029	\N	10215476045563023	\N	Raymond Pang	psfr937@gmail.com	\N	https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10215476045563023&height=50&width=50&ext=1528949355&hash=AeSJIMC5EOJnQaQp	\N	2018-06-11 12:09:15.369778	2018-06-11 18:10:32.650656	male	Pang	Raymond	\N	\N	\N
28	U00000028	\N	\N	\N	Raymond Pang	psfr937@gmail.com	ddb5f8063526bcb2d62458d308629d94	\N	\N	\N	2018-06-11 17:23:24.457538	\N	\N	\N	\N	7F5E2F	\N
\.


--
-- Name: email_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_id_seq', 1, false);


--
-- Name: kit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kit_id_seq', 1, false);


--
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_id_seq', 136, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 30, true);


--
-- Name: kit kit_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kit
    ADD CONSTRAINT kit_id_pk PRIMARY KEY (id);


--
-- Name: session session_session_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_session_id_pk PRIMARY KEY (session_id);


--
-- Name: email_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX email_id_uindex ON public.email USING btree (id);


--
-- Name: kit_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX kit_id_uindex ON public.kit USING btree (id);


--
-- Name: kit_testcode_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX kit_testcode_uindex ON public.kit USING btree (testcode);


--
-- Name: session_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX session_id_uindex ON public.session USING btree (id);


--
-- Name: session_session_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX session_session_id_uindex ON public.session USING btree (session_id);


--
-- Name: user_facebook_agent_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_facebook_agent_id_uindex ON public.user_info USING btree (facebook_agent_id);


--
-- Name: user_google-agent_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "user_google-agent_id_uindex" ON public.user_info USING btree (google_agent_id);


--
-- Name: user_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_id_uindex ON public.user_info USING btree (id);


--
-- Name: user_uuid_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_uuid_uindex ON public.user_info USING btree (user_id);


--
-- PostgreSQL database dump complete
--

